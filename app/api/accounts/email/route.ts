import User from "@/database/user.model";
import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";

// POST function to get the account by email
export async function POST(request: Request) {
  const { email } = await request.json();
  
  try {
    await dbConnect();

    // First, find the User by email.
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    // Then, find the Account associated with the user.
    const account = await Account.findOne({ userId: user._id });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
}