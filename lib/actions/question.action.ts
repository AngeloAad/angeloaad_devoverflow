"use server";

import Question, { IQuestionDoc } from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import mongoose, { FilterQuery } from "mongoose";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import dbConnect from "../mongoose";
import { Answer, Collection, Vote } from "@/database";
import { revalidatePath } from "next/cache";
import { createInteraction } from "./interactions.action";
import { after } from "next/server";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  // Validate input and check user authorization
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  // Return error if validation fails
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // Extract validated data
  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  // Start MongoDB transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create question document
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    // Prepare arrays for tag processing
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    // Process each tag provided by the user
    for (const tag of tags) {
      // Find existing tag with case-insensitive matching or create a new one
      // $setOnInsert ensures we only set name if creating a new document
      // $inc increments the question count for this tag by 1
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        {
          $setOnInsert: { name: tag }, // Only set name if creating new tag
          $inc: { questions: 1 }, // Increment question count either way
        },
        {
          upsert: true, // Create tag if it doesn't exist
          new: true, // Return the updated/created document
          session, // Use the transaction session
        }
      );

      // Store tag ID
      tagIds.push(existingTag._id);

      // Prepare many-to-many relationship document
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    // Create tag-question relationships
    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // Update question with tag references
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    after(async () => {
      await createInteraction({
        action: "post",
        actionId: question._id.toString(),
        actionType: "question",
        authorId: userId as string,
      });
    });

    // Commit transaction
    await session.commitTransaction();

    // Return success response
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    // If any error occurs, abort the transaction and roll back all changes
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    // Always close session
    session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<IQuestionDoc>> {
  // Validate input data and check user authorization
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  // Return error if validation fails
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // Extract validated data
  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  // Start MongoDB transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch question with populated tags
    const question = await Question.findById(questionId).populate("tags");

    // Check if question exists
    if (!question) {
      throw new Error("Question not found");
    }

    // Verify user is the author
    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    // Update title and content if changed
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // Identify tags to add (new tags not in current question)
    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some(
          (t: ITagDoc) => t.name.toLowerCase() === tag.toLowerCase()
        )
    );

    // Identify tags to remove (current tags not in updated list)
    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    // Prepare array for new tag-question relationships
    const newTagDocuemnts = [];

    // Process tags to add
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        // Find or create tag with case-insensitive matching
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          {
            $setOnInsert: { name: tag },
            $inc: { questions: 1 },
          },
          { upsert: true, new: true, session }
        );

        if (existingTag) {
          // Prepare tag-question relationship
          newTagDocuemnts.push({
            tag: existingTag._id,
            question: questionId,
          });

          // Add tag to question's tags array
          question.tags.push(existingTag._id);
        }
      }
    }

    // Process tags to remove
    if (tagsToRemove.length > 0) {
      // Get IDs of tags to remove
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      // Decrement question count for removed tags
      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );

      // Remove tag-question relationships
      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session }
      );

      // Remove tags from question's tags array
      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    // Create new tag-question relationships
    if (newTagDocuemnts.length > 0) {
      await TagQuestion.insertMany(newTagDocuemnts, { session });
    }

    // Save updated question
    await question.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Return success response
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    // Always close session
    session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<Question>> {
  // Validate input and check user authorization
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  // Return error if validation fails
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // Extract validated questionId
  const { questionId } = validationResult.params!;

  try {
    // Fetch question with populated tags
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "_id name image");

    // Check if question exists
    if (!question) {
      throw new Error("Question not found");
    }

    // Return success response with question data
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    // Handle and format any errors
    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Question> = {};

  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "_id name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementViews(params: IncrementViewsParams) {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.views += 1;
    await question.save();

    return { success: true, data: { views: question.views } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getHotQuestions(): Promise<ActionResponse<Question[]>> {
  try {
    await dbConnect();

    const questions = await Question.find()
      .sort({ views: -1, upvotes: -1 })
      .limit(5);
    return { success: true, data: JSON.parse(JSON.stringify(questions)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new Error("Question not found");

    if (question.author.toString() !== userId) {
      throw new Error("You are not authorized to delete this question");
    }

    await Collection.deleteMany({ question: questionId }).session(session);
    await TagQuestion.deleteMany({ question: questionId }).session(session);

    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      );
    }

    await Vote.deleteMany({
      actionId: questionId,
      actionType: "question",
    }).session(session);

    const answers = await Answer.find({ question: questionId }).session(
      session
    );

    if (answers.length > 0) {
      await Answer.deleteMany({ question: questionId }).session(session);
      await Vote.deleteMany({
        actionId: { $in: answers.map((answer) => answer._id) },
        actionType: "answer",
      }).session(session);
    }

    await Question.findByIdAndDelete(questionId).session(session);

    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: questionId,
        actionType: "question",
        authorId: userId as string,
      });
    });

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/profile/${userId}`);

    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  }
}
