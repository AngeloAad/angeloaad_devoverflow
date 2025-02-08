// This is a template model for creating a new model
import { model, models, Schema, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IModel {}

// 2. Create a Schema corresponding to the document interface.
const ModelSchema = new Schema<IModel>({});

// 3. Create a Model.
const Model = models?.Model || model<IModel>("Model", ModelSchema);

export default Model;
