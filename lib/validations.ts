import { z } from "zod";

// =========================================================================
// Search/Pagination Related Schemas (Define first as others depend on it)
// =========================================================================
export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

// =========================================================================
// Auth Related Schemas
// =========================================================================
export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long. " })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});
export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});
export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    image: z.string().url("Invalid image URL").optional(),
  }),
});
export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

// =========================================================================
// Question Related Schemas
// =========================================================================
export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  content: z.string().min(50, { message: "Body is required." }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required." })
        .max(30, { message: "Tag cannot exceed 30 characters." })
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "Cannot add more than 5 tags." }),
});
export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
export const DeleteQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

// =========================================================================
// Answer Related Schemas
// =========================================================================
export const AnswerSchema = z.object({
  content: z
    .string()
    .min(50, { message: "Answer must be at least 50 characters long." }),
});
export const EditAnswerSchema = AnswerSchema.extend({
  answerId: z.string().min(1, { message: "Answer ID is required." }),
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
export const DeleteAnswerSchema = z.object({
  answerId: z.string().min(1, { message: "Answer ID is required." }),
});
export const CreateAnswerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});
export const GetAnswerSchema = z.object({
  answerId: z.string().min(1, { message: "Answer ID is required." }),
});

// =========================================================================
// Vote Related Schemas
// =========================================================================
export const CreateVoteSchema = z.object({
  actionId: z.string().min(1, { message: "Action ID is required." }),
  actionType: z.enum(["question", "answer"], {
    message: "Invalid action type.",
  }),
  voteType: z.enum(["upvote", "downvote"], { message: "Invalid vote type." }),
});
export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1),
});
export const GetVoteSchema = CreateVoteSchema.pick({
  actionId: true,
  actionType: true,
});

// =========================================================================
// Collection Related Schemas
// =========================================================================
export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

// =========================================================================
// User Related Schemas
// =========================================================================
export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  bio: z.string().optional(),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid URL." })
    .optional(),
  reputation: z.number().optional(),
});
export const GetUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});
export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, { message: "User ID is required." }),
});
export const GetUserAnswersSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, { message: "User ID is required." }),
});
export const GetUserTagsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});

// =========================================================================
// Tag Related Schemas
// =========================================================================
export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required." }),
});

// =========================================================================
// AI Related Schemas
// =========================================================================
export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(1, { message: "Question is required." })
    .max(150, { message: "Question cannot exceed 150 characters." }),
  content: z
    .string()
    .min(50, { message: "Answer has to have more than 50 characters." }),
  userAnswer: z.string().optional(),
});
