"use server";

import mongoose, { ClientSession } from "mongoose";

import { Answer, Question, Vote } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateVoteSchema,
  GetVoteSchema,
  UpdateVoteCountSchema,
} from "../validations";
import {
  createInteraction,
  reverseReputationForVote,
} from "./interactions.action";
import { after } from "next/server";

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { actionId, actionType, voteType, change } = validationResult.params!;

  const Model = actionType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      actionId,
      { $inc: { [voteField]: change } },
      { new: true, session }
    );

    if (!result)
      return handleError(
        new Error(`Failed to update ${actionType} vote count`)
      ) as ErrorResponse;

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(
  params: CreateVoteParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { actionId, actionType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const Model = actionType === "question" ? Question : Answer;

    const contentDoc = await Model.findById(actionId).session(session);
    if (!contentDoc) throw new Error("Content not found");

    const contentAuthorId = contentDoc.author.toString();

    const existingVote = await Vote.findOne({
      author: userId,
      actionId,
      actionType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        const removedVoteType = existingVote.voteType;
        // If the user has already voted with the same voteType, remove the vote
        await Vote.findByIdAndDelete(existingVote._id).session(session);
        await updateVoteCount(
          { actionId, actionType, voteType, change: -1 },
          session
        );

        // Reverse reputation changes when vote is removed
        await reverseReputationForVote({
          voteType: removedVoteType,
          performerId: userId,
          authorId: contentAuthorId,
          session,
        });
        
        // Do not create an interaction for vote removal
      } else {
        // If the user has already voted with a different voteType, update the vote
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );

        // Decrement the previous vote type
        await updateVoteCount(
          { actionId, actionType, voteType: existingVote.voteType, change: -1 },
          session
        );

        // Increment the new vote type
        await updateVoteCount(
          { actionId, actionType, voteType, change: 1 },
          session
        );
        
        // For vote type change, create an interaction
        if (contentAuthorId && (voteType === "upvote" || voteType === "downvote")) {
          after(async () => {
            await createInteraction({
              action: voteType,
              actionId: actionId,
              actionType: actionType,
              authorId: contentAuthorId,
            });
          });
        }
      }
    } else {
      // If the user has not voted yet, create a new vote
      await Vote.create(
        [
          {
            author: userId,
            actionId,
            actionType,
            voteType,
          },
        ],
        {
          session,
        }
      );

      await updateVoteCount(
        { actionId, actionType, voteType, change: 1 },
        session
      );
      
      // Create interaction for new vote
      if (contentAuthorId && (voteType === "upvote" || voteType === "downvote")) {  
        after(async () => {
          await createInteraction({
            action: voteType,
            actionId: actionId,
            actionType: actionType,
            authorId: contentAuthorId,
          });
        });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}

export async function getVote(
  params: GetVoteParams
): Promise<ActionResponse<GetVoteResponse>> {
  const validationResult = await action({
    params,
    schema: GetVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { actionId, actionType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId,
      actionType,
    });

    if (!vote) {
      return {
        success: false,
        data: {
          upvoted: false,
          downvoted: false,
        },
      };
    }

    return {
      success: true,
      data: {
        upvoted: vote.voteType === "upvote",
        downvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
