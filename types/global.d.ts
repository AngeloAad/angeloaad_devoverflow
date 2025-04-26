interface Tag {
  _id: string;
  name: string;
  questions?: number;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}

interface Answer {
  _id: string;
  content: string;
  author: Author;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  question: Question;
}

interface Collection {
  _id: string;
  author: Author;
  question: Question;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
}
interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}
interface Badges {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

interface Country {
  name: {
    common: string;
  };
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>; // example: /questions/:id
  searchParams: Promise<Record<string, string>>; // example: /questions?tag=javascript
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface IncrementViewsParams {
  questionId: string;
}

interface GlobalSearchedItem {
  id: string;
  type: "question" | "answer" | "user" | "tag";
  title: string;
}
