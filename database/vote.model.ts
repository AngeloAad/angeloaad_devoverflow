import { model, models, Schema, Types, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: string;
  voteType: string;
}

export interface IVoteDoc extends IVote, Document {}
const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

// 3. Create a Vote.
const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
