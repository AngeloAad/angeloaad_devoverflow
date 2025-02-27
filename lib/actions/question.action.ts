"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";
import mongoose from "mongoose";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

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
          $inc: { question: 1 }, // Increment question count either way
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
): Promise<ActionResponse<Question>> {
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
      (tag) => !question.tags.includes(tag.toLowerCase())
    );

    // Identify tags to remove (current tags not in updated list)
    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) => !tags.includes(tag.name.toLowerCase())
    );

    // Prepare array for new tag-question relationships
    const newTagDocuemnts = [];

    // Process tags to add
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        // Find or create tag with case-insensitive matching
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          {
            $setOnInsert: { name: tag },
            $inc: { question: 1 },
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
        { $inc: { question: -1 } },
        { session }
      );

      // Remove tag-question relationships
      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session }
      );

      // Remove tags from question's tags array
      question.tags = question.tags.filter(
        (tagId: mongoose.Types.ObjectId) => !tagsToRemove.includes(tagId)
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
    const question = await Question.findById(questionId).populate("tags");

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
