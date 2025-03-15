"use client";

import { use, useState } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { createVote } from "@/lib/actions/vote.action";
interface VotesProps {
  upvotes: number;
  downvotes: number;
  actionType: "question" | "answer";
  actionId: string;
  getVotePromise: Promise<ActionResponse<GetVoteResponse>>;
}

const Votes = ({
  upvotes,
  downvotes,
  actionType,
  actionId,
  getVotePromise,
}: VotesProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const { success, data } = use(getVotePromise);
  const { upvoted, downvoted } = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast({
        title: "Please log in to vote",
        description: "You must be logged in to vote",
        variant: "destructive",
      });
    }

    setIsLoading(true);

    try {
      const result = await createVote({
        actionId,
        actionType,
        voteType,
      });

      if (!result.success) {
        toast({
          title: "Failed to vote",
          description:
            result.error?.message ||
            "An error occurred while voting, please try again.",
          variant: "destructive",
        });
        return;
      }

      const isNowUpvoted = voteType === "upvote" ? !upvoted : upvoted;
      const isNowDownvoted = voteType === "downvote" ? !downvoted : downvoted;

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${isNowUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${isNowDownvoted ? "added" : "removed"} successfully`;

      toast({
        title: successMessage,
        description: "Your vote has been registered successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to vote",
        description: "An error occurred while voting, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={success && upvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            success && downvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
