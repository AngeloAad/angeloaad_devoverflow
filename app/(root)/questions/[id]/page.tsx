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

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const { success, data: question } = await getQuestion({
    questionId: id,
  });

  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success || !question) {
    return redirect("/404");
  }

  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "newest",
  });

  const getVotePromise = getVote({
    actionId: question._id,
    actionType: "question",
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
            <div className="flex items-center">
              <Suspense fallback={<VotesSkeleton />}>
                <Votes
                  upvotes={upvotes}
                  downvotes={downvotes}
                  actionType="question"
                  actionId={question._id}
                  getVotePromise={getVotePromise}
                />
              </Suspense>
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
