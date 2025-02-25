"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";
import mongoose from "mongoose";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

/**
 * Creates a new question with associated tags in a Q&A platform.
 *
 * This function handles the complete workflow of:
 * 1. Validating user input and authorization
 * 2. Creating a question document
 * 3. Processing tags (finding existing or creating new ones)
 * 4. Establishing relationships between questions and tags
 * 5. Updating question count statistics for tags
 *
 * The entire operation is wrapped in a MongoDB transaction to ensure
 * data consistency across all collections. If any step fails, all
 * changes are rolled back.
 *
 * @param params - Object containing question title, content, and tags
 * @returns Promise resolving to success response with question data or error response
 */
export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  // Validate input data against schema and verify user authorization
  // This uses a custom action handler to centralize validation logic
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true, // Requires user to be authenticated
  });

  // Return early if validation fails
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // Extract validated data and user information
  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  // Start MongoDB transaction to ensure atomicity across operations
  // If any operation fails, all changes will be rolled back
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the question document with author reference
    // Note: Using array syntax for create() to work with transaction session
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    // Arrays to collect tag IDs and tag-question relationship documents
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    // Process each tag provided by the user
    for (const tag of tags) {
      // Find existing tag with case-insensitive matching or create a new one
      // $setOnInsert ensures we only set name if creating a new document
      // $inc increments the question count for this tag by 1
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // Case-insensitive match
        {
          $setOnInsert: { name: tag }, // Only set name if creating new tag
          $inc: { question: 1 }, // Increment question count either way
        },
        {
          upsert: true, // Create tag if it doesn't exist
          new: true, // Return the updated/created document
          session, // Use the transaction session
        }
      );

      // Store the tag ID for later use
      tagIds.push(existingTag._id);

      // Prepare document for the many-to-many relationship table
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    // Insert all tag-question relationships in one operation
    // This establishes the many-to-many relationship between tags and questions
    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // Update the question document to include references to all associated tags
    // $push with $each adds multiple values to the tags array field at once
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    // Commit transaction since all operations succeeded
    await session.commitTransaction();

    // Return success response with question data
    // JSON conversion handles any MongoDB-specific objects
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    // If any error occurs, abort the transaction and roll back all changes
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    // Always close the session regardless of success or failure
    session.endSession();
  }
}
