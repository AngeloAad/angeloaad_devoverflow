"use server";

import Answer, { IAnswerDoc } from "@/database/answer.model";
import {
  CreateAnswerSchema,
  DeleteAnswerSchema,
  EditAnswerSchema,
  GetAnswersSchema,
} from "../validations";
import mongoose, { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { Question, Vote } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export const createAnswer = async (
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> => {
  const validationResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, content } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const [answer] = await Answer.create(
      [{ question: questionId, content, author: userId }],
      { session }
    );

    if (!answer) {
      throw new Error("Failed to create answer");
    }

    await Question.findByIdAndUpdate(
      questionId,
      {
        $inc: { answers: 1 },
      },
      { session }
    );

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getAnswers = async (
  params: GetAnswersParams
): Promise<
  ActionResponse<{ answers: Answer[]; isNext: boolean; totalAnswers: number }>
> => {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    questionId,
    page = 1,
    pageSize = 10,
    filter,
  } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Answer> = { question: questionId };

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const totalAnswers = await Answer.countDocuments(filterQuery);
    const answers = await Answer.find(filterQuery)
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const editAnswer = async (
  params: EditAnswerParams
): Promise<ActionResponse<IAnswerDoc>> => {
  const validationResult = await action({
    params,
    schema: EditAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId, content } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer.author.toString() !== userId) {
      throw new Error("You are not authorized to edit this answer");
    }

    answer.content = content;
    await answer.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Revalidate the question page to show the updated answer
    revalidatePath(ROUTES.QUESTION(answer.question.toString()));

    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    await session.abortTransaction(); // Abort transaction on error
    session.endSession(); // Ensure session ends even on error
    return handleError(error) as ErrorResponse;
  } finally {
    // Ensure session ends if not already ended
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    await session.endSession();
  }
};

export const deleteAnswer = async (
  params: DeleteAnswerParams
): Promise<ActionResponse<IAnswerDoc>> => {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer.author.toString() !== userId) {
      throw new Error("You are not authorized to delete this answer");
    }

    await Question.findByIdAndUpdate(
      answer.question,
      { $inc: { answers: -1 } },
      { new: true, session }
    );

    await Vote.deleteMany({ actionId: answerId, actionType: "answer" }).session(
      session
    );

    await Answer.findByIdAndDelete(answerId).session(session);

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/profile/${userId}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  }
};
