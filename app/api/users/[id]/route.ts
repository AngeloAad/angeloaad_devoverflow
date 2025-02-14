// I have added comments for this file to help you understand the logic behind how each function works/what it does
// hope that helps :)

import User from "@/database/user.model"; // Import the User model for database operations
import handleError from "@/lib/handlers/error"; // Import error handling function
import { NotFoundError } from "@/lib/http-errors"; // Import custom error for not found
import dbConnect from "@/lib/mongoose"; // Import database connection function
import { UserSchema } from "@/lib/validations"; // Import user validation schema
import { NextResponse } from "next/server"; // Import Next.js response handling

// GET /api/users/[id]
// This function handles GET requests to fetch a user by their ID.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Extract the user ID from the request parameters
  if (!id) throw new NotFoundError("User"); // If no ID is provided, throw a not found error

  try {
    await dbConnect(); // Connect to the database

    const user = await User.findById(id); // Find the user by ID
    if (!user) throw new NotFoundError("User"); // If user not found, throw a not found error

    return NextResponse.json({ success: true, data: user }, { status: 200 }); // Return the user data as JSON
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse; // Handle any errors that occur
  }
}

// DELETE /api/users/[id]
// This function handles DELETE requests to remove a user by their ID.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Extract the user ID from the request parameters
  if (!id) throw new NotFoundError("User"); // If no ID is provided, throw a not found error

  try {
    await dbConnect(); // Connect to the database

    const user = await User.findByIdAndDelete(id); // Find and delete the user by ID
    if (!user) throw new NotFoundError("User"); // If user not found, throw a not found error

    return NextResponse.json({ success: true, data: user }, { status: 200 }); // Return success response
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse; // Handle any errors that occur
  }
}

// PUT /api/users/[id]
// This function handles PUT requests to update a user's information by their ID.
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Extract the user ID from the request parameters
  if (!id) throw new NotFoundError("User"); // If no ID is provided, throw a not found error

  try {
    await dbConnect(); // Connect to the database

    const body = await request.json(); // Get the request body as JSON
    const validatedData = UserSchema.partial().parse(body); // Validate the incoming data

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true, // Return the updated user
    });

    if (!updatedUser) throw new NotFoundError("User"); // If user not found, throw a not found error

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    ); // Return the updated user data
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse; // Handle any errors that occur
  }
}
