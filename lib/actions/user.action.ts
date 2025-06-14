"use server";

import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  GetUserAnswersSchema,
  GetUserQuestionsSchema,
  GetUserRecommendationsSchema,
  GetUserSchema,
  GetUserStatsSchema,
  GetUserTagsSchema,
  PaginatedSearchParamsSchema,
  UpdateUserSchema,
} from "../validations";
import { User, Question, Answer, Tag } from "@/database";
import mongoose, { PipelineStage } from "mongoose";
import { assignBadges } from "@/lib/utils";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(params: GetUserParams): Promise<
  ActionResponse<{
    user: User;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return {
      success: true,
      data: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateUser(params: UpdateUserParams): Promise<
  ActionResponse<{
    user: User;
  }>
> {
  const validationResult = await action({
    params,
    schema: UpdateUserSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult.session!;

  try {
    const updatedUser = await User.findByIdAndUpdate(user?.id, params, {
      new: true,
    });

    return {
      success: true,
      data: { user: JSON.parse(JSON.stringify(updatedUser)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
  ActionResponse<{
    questions: Question[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate("author", "_id name image")
      .populate("tags", "_id name")
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

export async function getUserAnswers(params: GetUserAnswersParams): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .populate("author", "_id name image")
      .populate("question", "_id title")
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: { answers: JSON.parse(JSON.stringify(answers)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserTags(params: GetUserTagsParams): Promise<
  ActionResponse<{
    tags: {
      _id: string;
      name: string;
      count: number;
    }[];
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserTagsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tag",
        },
      },
      { $unwind: "$tag" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tag._id",
          name: "$tag.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserStats(params: GetUserStatsParams): Promise<
  ActionResponse<{
    badges: Badges;
    reputation: number;
    questions: number;
    answers: number;
    totalViews: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserStatsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const questionsDataPipeline = await Question.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          questionCount: { $sum: 1 },
          questionUpvotes: { $sum: "$upvotes" },
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const questionStats = questionsDataPipeline[0] || {
      questionCount: 0,
      questionUpvotes: 0,
      totalViews: 0,
    };

    const answersDataPipeline = await Answer.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          answerCount: { $sum: 1 },
          answerUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const answerStats = answersDataPipeline[0] || {
      answerCount: 0,
      answerUpvotes: 0,
    };

    const questions = questionStats.questionCount;
    const answers = answerStats.answerCount;
    const totalViews = questionStats.totalViews;

    const questionUpvotes = questionStats.questionUpvotes;
    const answerUpvotes = answerStats.answerUpvotes;

    const totalUpvotes = questionUpvotes + answerUpvotes;
    const reputation = totalUpvotes * 10;

    const badges = assignBadges({
      criteria: [
        { type: "QUESTION_COUNT", count: questions },
        { type: "ANSWER_COUNT", count: answers },
        { type: "QUESTION_UPVOTES", count: questionUpvotes },
        { type: "ANSWER_UPVOTES", count: answerUpvotes },
        { type: "TOTAL_VIEWS", count: totalViews },
      ],
    });

    return {
      success: true,
      data: { badges, reputation, questions, answers, totalViews },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
