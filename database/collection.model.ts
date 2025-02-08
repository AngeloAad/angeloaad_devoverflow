// This is a template model for creating a new model
import { model, models, Schema, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

// 3. Create a Collection.
const Collection =
  models?.Collection || model<ICollection>("Collection", CollectionSchema);

export default Collection;
