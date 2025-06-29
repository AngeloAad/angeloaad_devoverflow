import Link from "next/link";
import React from "react";
import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import TagCard from "./TagCard";
import Metric from "../Metric";
import { getSavedQuestion } from "@/lib/actions/collection.action";
import SaveButtonContainer from "../questions/SaveButtonContainer";
import EditDeleteAction from "../user/EditDeleteAction";
import UserAvatar from "../UserAvatar";

interface Props {
  question: Question;
  showSaveButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

const QuestionCard = ({
  question: { _id, title, tags, author, createdAt, upvotes, answers, views },
  showSaveButton = false,
  showEditButton = false,
  showDeleteButton = false,
}: Props) => {
  const getSavedQuestionPromise = getSavedQuestion({
    questionId: _id,
  });

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <div className="flex-between w-full gap-5">
            <Link href={ROUTES.QUESTION(_id)}>
              <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-2">
                {title}
              </h3>
            </Link>

            {showSaveButton && (
              <SaveButtonContainer
                questionId={_id}
                getSavedQuestionPromise={getSavedQuestionPromise}
              />
            )}

            {(showEditButton || showDeleteButton) && (
              <EditDeleteAction
                type="Question"
                itemId={_id}
                showEditButton={showEditButton}
                showDeleteButton={showDeleteButton}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-6 rounded-full object-cover"
          />
          <span className="body-medium text-dark400_light700">
            {author.name}
          </span>
          <span className="body-medium text-dark400_light700 max-sm:hidden">
            • asked {getTimeStamp(createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
