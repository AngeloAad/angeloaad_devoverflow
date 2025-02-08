// This is a template Answer for creating a new Answer
import { model, models, Schema, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IAnswer {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upvotes?: number;
  downvotes?: number;
}

// 2. Create a Schema corresponding to the document interface.
const AnswerSchema = new Schema<IAnswer>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 3. Create a Answer.
const Answer = models?.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
