import mongoose, { ClientSession } from "mongoose";

import { CreateInteractionSchema } from "../validations";
import { Interaction, User } from "../../database";
import { IInteractionDoc } from "@/database/interaction.model";
import handleError from "../handlers/error";
import action from "../handlers/action";

export const createInteraction = async (
  params: CreateInteractionParams
): Promise<ActionResponse<IInteractionDoc>> => {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    action: actionType,
    actionId,
    actionType: actionTarget,
    authorId, // person who created the content (question/answer)
  } = validationResult.params!;
  const UserId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: UserId,
          action: actionType,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session }
    );

    await updateReputation({
      interaction,
      session,
      performerId: UserId!,
      authorId,
    });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(interaction)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performerId, authorId } = params;
  const { action, actionType } = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case "upvote":
      performerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      performerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      performerPoints = actionType === "question" ? 2 : 5;
      break;
    case "delete":
      authorPoints = actionType === "question" ? -5 : -10;
      performerPoints = actionType === "question" ? -2 : -5;
      break;
    case "bookmark":
      performerPoints = 1;
      authorPoints = 2;
      break;
    case "unbookmark":
      performerPoints = -1;
      authorPoints = -2;
      break;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: performerPoints } },
      { session }
    );

    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
    ],
    { session }
  );
}

export async function reverseReputationForVote(params: ReverseReputationParams) {
    const { voteType, performerId, authorId, session } = params;
  
    let performerPointsToReverse = 0;
    let authorPointsToReverse = 0;
  
    switch (voteType) {
      case "upvote":
        performerPointsToReverse = -2;
        authorPointsToReverse = -10;
        break;
      case "downvote":
        performerPointsToReverse = 1;
        authorPointsToReverse = 2;
        break;
    }

    if (performerId === authorId) {
        await User.findByIdAndUpdate(
          performerId,
          { $inc: { reputation: performerPointsToReverse } },
          { session }
        );
    
        return;
      }
  
    const bulkOps = [];
    
    bulkOps.push({
      updateOne: {
        filter: { _id: authorId },
        update: { $inc: { reputation: authorPointsToReverse } },
      },
    });
    
    bulkOps.push({
      updateOne: {
        filter: { _id: performerId },
        update: { $inc: { reputation: performerPointsToReverse } },
      },
    });
  
    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps, { session });
    }
  }
