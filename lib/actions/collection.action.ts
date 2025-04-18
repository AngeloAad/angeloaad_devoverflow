"use server";

import { Question, Collection } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import mongoose, { PipelineStage } from "mongoose";
import { after } from "next/server";
import { createInteraction } from "./interactions.action";

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(ROUTES.QUESTION(questionId));

      after(async () => {
        await createInteraction({
          action: "unbookmark",
          actionId: questionId,
          actionType: "question",
          authorId: userId as string,
          });
      });

      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({ author: userId, question: questionId });

    revalidatePath(ROUTES.QUESTION(questionId));

    after(async () => {
        await createInteraction({
          action: "bookmark",
          actionId: questionId,
          actionType: "question",
          authorId: userId as string,
        });
    });

    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    return {
      success: true,
      data: {
        saved: !!collection,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collection: Collection[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria =
    sortOptions[filter as keyof typeof sortOptions] || sortOptions.mostrecent;

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({ $project: { question: 1, author: 1 } });

    const questions = await Collection.aggregate(pipeline);

    const isNext = (totalCount?.total || 0) > skip + questions.length;

    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
