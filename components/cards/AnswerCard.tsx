// Removing "use client" to make AnswerCard a Server Component again
import React, { Suspense } from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { cn, getTimeStamp } from "@/lib/utils";
import Preview from "../editor/Preview"; // Use regular import
import Votes from "../votes/Votes";
import VotesSkeleton from "../votes/VotesSkeleton";
import { getVote } from "@/lib/actions/vote.action";
import EditDeleteAction from "../user/EditDeleteAction";

interface AnswerCardProps extends Answer {
  containerClasses?: string;
  showReadMode?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

const AnswerCard = ({
  _id,
  author,
  content: initialContent,
  upvotes,
  downvotes,
  createdAt,
  question,
  containerClasses,
  showReadMode = false,
  showEditButton = false,
  showDeleteButton = false,
}: AnswerCardProps) => {
  const getVotePromise = getVote({
    actionId: _id,
    actionType: "answer",
  });

  return (
    <article className={cn("light-border border-b py-10", containerClasses)}>
      <span id={`answer-${_id}`} className="hash-span" />

      <div
        className="flex flex-col-reverse justify-between gap-5 sm:flex-row
        sm:items-center sm:gap-2 mb-5"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-1 gap-1 sm:items-center">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-6 rounded-full object-cover max-sm:mt-1.5"
            />

            <Link
              href={ROUTES.PROFILE(author._id)}
              className="flex flex-col sm:flex-row sm:items-center"
            >
              <p className="body-semibold text-dark300_light700">
                {author.name ?? "Anonymous"}
              </p>

              <p className="small-regular text-light400_light500 max-sm:mt-0.5 sm:ml-1">
                <span className="max-sm:hidden"> • </span>
                answered {getTimeStamp(createdAt)}
              </p>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-end gap-3">
            <Suspense fallback={<VotesSkeleton />}>
              <Votes
                upvotes={upvotes}
                downvotes={downvotes}
                actionType="answer"
                actionId={_id}
                getVotePromise={getVotePromise}
              />
            </Suspense>
            {(showEditButton || showDeleteButton) && (
              <EditDeleteAction
                type="Answer"
                itemId={_id}
                showEditButton={showEditButton}
                showDeleteButton={showDeleteButton}
              />
            )}
          </div>
        </div>
      </div>

      {/* Server-rendered Preview */}
      <Preview content={initialContent} />

      {showReadMode && (
        <Link
          href={`/questions/${question._id}#answer-${_id}`}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-2">Read More...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
