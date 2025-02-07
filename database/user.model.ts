import { model, models, Schema } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image: string;
  location?: string;
  portfolio?: string;
  reputation?: string;
}

// 2. Create a Schema corresponding to the document interface.
export const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String, required: true },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: String, default: 0 },
  },
  { timestamps: true }
);

// 3. Create a Model.
const User = models?.User || model<IUser>("User", UserSchema);

export default User;
