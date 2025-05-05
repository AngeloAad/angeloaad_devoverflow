import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import React, { Suspense } from "react";
import { after } from "next/server";
import AnswerForm from "@/components/forms/AnswerForm";
import { getAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/AllAnswers";
import Votes from "@/components/votes/Votes";
import VotesSkeleton from "@/components/votes/VotesSkeleton";
import { getVote } from "@/lib/actions/vote.action";
// import SaveQuestions from "@/components/questions/SaveQuestions";
import { getSavedQuestion } from "@/lib/actions/collection.action";
// import SaveQuestionsSkeleton from "@/components/questions/SaveQuestionsSkeleton";
import SaveButtonContainer from "@/components/questions/SaveButtonContainer";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data: question } = await getQuestion({ questionId: params.id });

  if (!question) {
    return {
      title: "Question Not Found",
    };
  }

  const { title, content, author, tags } = question;

  return {
    title: title,
    description: content.slice(0, 100), // First 160 characters for SEO
    keywords: tags.map((tag: any) => tag.name).join(", "),
    authors: [{ name: author.name }],
    openGraph: {
      title: title,
      description: content.slice(0, 160),
      type: "article",
      authors: author.name,
      publishedTime: question.createdAt.toISOString(),
      modifiedTime: question.createdAt.toISOString(),
      tags: tags.map((tag: any) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: content.slice(0, 160),
    },
  };
}

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;
  const { success, data: question } = await getQuestion({
    questionId: id,
  });

  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success || !question) {
    return redirect(ROUTES.SIGN_IN);
  }

  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });

  const getVotePromise = getVote({
    actionId: question._id,
    actionType: "question",
  });

  const getSavedQuestionPromise = getSavedQuestion({
    questionId: question._id,
  });

  const {
    author,
    createdAt,
    title,
    content,
    tags,
    answers,
    views,
    upvotes,
    downvotes,
  } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex flex-col-reverse w-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <UserAvatar
                id={author._id}
                name={author.name}
                imageUrl={author.image}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              />
              <Link href={ROUTES.PROFILE(author._id)}>
                <p className="paragraph-semibold text-dark300_light700">
                  {author.name}
                </p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Suspense fallback={<VotesSkeleton />}>
                <Votes
                  upvotes={upvotes}
                  downvotes={downvotes}
                  actionType="question"
                  actionId={question._id}
                  getVotePromise={getVotePromise}
                />
              </Suspense>

              <SaveButtonContainer
                questionId={question._id}
                getSavedQuestionPromise={getSavedQuestionPromise}
              />
            </div>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` Asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />

        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={`${answers} Answers`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />

        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={`${formatNumber(views)} Views`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-10">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answersResult?.isNext || false}
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>

      <section className="my-10">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
