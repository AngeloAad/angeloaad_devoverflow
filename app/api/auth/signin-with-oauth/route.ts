// Import necessary modules and libraries
import mongoose from "mongoose"; // MongoDB ODM for database operations
import { NextResponse } from "next/server"; // Next.js response helper
import slugify from "slugify"; // Utility to create URL-friendly slugs

// Import database models, error handlers, DB connection, and validation schemas
import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

// POST handler for OAuth sign-in requests
export async function POST(request: Request) {
  // Parse the incoming request JSON to extract provider info and user details
  const { provider, providerAccountId, user } = await request.json();

  // Ensure a connection to the database
  await dbConnect();

  // Start a new MongoDB session and begin a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate the incoming data against the OAuth sign-in schema
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    // If validation fails, throw an error with details of the invalid fields
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    // Destructure the necessary user fields from the request
    const { name, username, email, image } = user;

    // Generate a slugified version of the username for URL-friendly use
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check if a user with the provided email already exists in the database
    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      // If the user does not exist, create a new user document
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session }
      );
    } else {
      // If the user exists, prepare to update any changed fields
      const updatedData: { name?: string; image?: string } = {};

      // Update name if it has changed
      if (existingUser.name !== name) updatedData.name = name;
      // Update image if it has changed
      if (existingUser.image !== image) updatedData.image = image;

      // If there are any changes, update the user document
      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    // Check if an OAuth account with this provider and providerAccountId exists for the user
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      // If the OAuth account is not linked yet, create a new account document
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    // If all operations are successful, commit the transaction
    await session.commitTransaction();

    // Return a JSON response indicating success
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // If any error occurs, abort the transaction to rollback changes
    await session.abortTransaction();
    // Use the custom error handler to return an appropriate error response
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    // End the session to free up resources, regardless of success or failure
    session.endSession();
  }
}
