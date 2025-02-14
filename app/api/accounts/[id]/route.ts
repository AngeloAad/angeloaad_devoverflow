// I have added comments for this file to help you understand the logic behind how each function works/what it does
// hope that helps :)

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error"; // Import error handling function
import { NotFoundError, ValidationError } from "@/lib/http-errors"; // Import custom error for not found
import dbConnect from "@/lib/mongoose"; // Import database connection function
import { UserSchema } from "@/lib/validations"; // Import user validation schema
import { NextResponse } from "next/server"; // Import Next.js response handling

// GET account by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Destructure ID from params
  if (!id) throw new NotFoundError("Account");

  try {
    await dbConnect(); // Connect to MongoDB

    const account = await Account.findById(id); // Find account by ID
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse; // Handle errors consistently
  }
}

// DELETE account by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Extract the user ID from the request parameters
  if (!id) throw new NotFoundError("Account"); // If no ID is provided, throw a not found error

  try {
    await dbConnect(); // Connect to the database

    const account = await Account.findByIdAndDelete(id); // Find and delete account
    if (!account) throw new NotFoundError("Account"); // If user not found, throw a not found error

    return NextResponse.json({ success: true, data: account }, { status: 200 }); // Return deleted account
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse; // Handle any errors that occur
  }
}

// Update account by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Extract the user ID from the request parameters
  if (!id) throw new NotFoundError("Account"); // If no ID is provided, throw a not found error

  try {
    await dbConnect(); // Connect to the database

    const body = await request.json();
    const validatedData = UserSchema.partial().safeParse(body); // Partial validation schema

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors); // Throw validation errors if any
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true, // Update with validated data (return new version)
    });

    if (!updatedAccount) throw new NotFoundError("Account");

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse; // Handle any errors that occur
  }
}
