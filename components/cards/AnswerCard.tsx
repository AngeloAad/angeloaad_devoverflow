import React from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Preview from "../editor/Preview";

const AnswerCard = ({
  _id,
  author,
  content,
  upvotes,
  downvotes,
  createdAt,
}: Answer) => {
  return (
    <article className="light-border border-b py-10">
      <span id={JSON.stringify(_id)} className="hash-span" />

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
          <div className="flex items-center">Votes</div>
        </div>
      </div>

      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
