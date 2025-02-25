import { model, models, Schema, Types, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface ITagQuestion {
  question: Types.ObjectId;
  tag: Types.ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
export interface ITagQuestionDoc extends ITagQuestion, Document {}
const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  { timestamps: true }
);

// 3. Create a TagQuestion.
const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
