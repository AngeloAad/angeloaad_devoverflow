"use server";

import Answer, {IAnswerDoc } from "@/database/answer.model";
import { CreateAnswerSchema } from "../validations";
import mongoose from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { Question } from "@/database";
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

    await Question.findByIdAndUpdate(questionId, {
      $inc: { answers: 1 },
    }, { session });

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
