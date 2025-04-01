interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}

interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateVoteParams {
  actionId: string;
  actionType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

type GetVoteParams = Pick<CreateVoteParams, "actionId" | "actionType">;

interface GetVoteResponse {
  upvoted: boolean;
  downvoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams extends Omit<PaginatedSearchParams, "filter" | "sort" | "query"> {
  userId: string;
}

interface GetUserAnswersParams extends Omit<PaginatedSearchParams, "filter" | "sort" | "query"> {
  userId: string;
}

interface GetUserTagsParams {
  userId: string;
}
