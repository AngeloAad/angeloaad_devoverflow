import { model, models, Schema, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IQuestion {
    title: string;
    content: string;
    tags: Types.ObjectId[];
    views?: number;
    answers?: number;
    upvotes?: number;
    downvotes?: number;
    author: Types.ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
const QuestionSchema = new Schema<IQuestion>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
})

// 3. Create a Model.
const Question = models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;