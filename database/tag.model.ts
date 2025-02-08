// This is a template model for creating a new model
import { model, models, Schema, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface ITag {
  name: string;
  questions?: number;
}

// 2. Create a Schema corresponding to the document interface.
const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 3. Create a Tag.
const Tag = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
