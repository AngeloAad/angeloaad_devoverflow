import { auth } from "@/auth";
import AnswerForm from "@/components/forms/AnswerForm";
import Preview from "@/components/editor/Preview";
import ROUTES from "@/constants/routes";
import { getAnswer } from "@/lib/actions/answer.action";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";

// + imports needed for full question header
import { getQuestion } from "@/lib/actions/question.action";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import { getVote } from "@/lib/actions/vote.action";
import { getSavedQuestion } from "@/lib/actions/collection.action";
import Votes from "@/components/votes/Votes";
import VotesSkeleton from "@/components/votes/VotesSkeleton";
import SaveButtonContainer from "@/components/questions/SaveButtonContainer";
import Metric from "@/components/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import TagCard from "@/components/cards/TagCard";
import type { Metadata } from "next";

const EditAnswer = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: answer, success } = await getAnswer({ answerId: id });
  if (!success || !answer) return notFound();

  // fetch the full question so we can show author, votes, tags, etc.
  const { data: question, success: qSuccess } = await getQuestion({
    questionId: answer.question._id,
  });
  if (!qSuccess || !question) return notFound();

  // prepare votes & save promises
  const getVotePromise = getVote({
    actionId: question._id,
    actionType: "question",
  });
  const getSavedQuestionPromise = getSavedQuestion({
    questionId: question._id,
  });

  if (answer.author._id !== session?.user?.id) redirect(ROUTES.HOME);

  return (
    <>
      {/* ——— Question details (same layout as questions/[id]/page.tsx) ——— */}
      <div className="flex-start w-full flex-col">
        <div className="flex flex-col-reverse w-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <UserAvatar
                id={question.author._id}
                name={question.author.name}
                imageUrl={question.author.image}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              />
              <Link href={ROUTES.PROFILE(question.author._id)}>
                <p className="paragraph-semibold text-dark300_light700">
                  {question.author.name}
                </p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Suspense fallback={<VotesSkeleton />}>
                <Votes
                  upvotes={question.upvotes}
                  downvotes={question.downvotes}
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
          {question.title}
        </h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          title=""
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={`Asked ${getTimeStamp(new Date(question.createdAt))}`}
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          title=""
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={`${question.answers} Answers`}
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          title=""
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={`${formatNumber(question.views)} Views`}
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      {/* ——— Answer edit form ——— */}
      <section className="my-10">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
          answer={answer}
          isEdit
        />
      </section>
    </>
  );
};

export default EditAnswer;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data: answer } = await getAnswer({ answerId: params.id });

  if (!answer) {
    return {
      title: "Answer Not Found",
    };
  }

  return {
    title: `Edit Answer - ${answer.question.title}`,
    description: `Edit your answer to the question: ${answer.question.title}`,
    robots: {
      index: false, // Don't index edit pages
      follow: true,
    },
  };
}
