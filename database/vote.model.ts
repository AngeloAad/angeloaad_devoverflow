// This is a template model for creating a new model
import { model, models, Schema, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
}

// 2. Create a Schema corresponding to the document interface.
const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

// 3. Create a Vote.
const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
