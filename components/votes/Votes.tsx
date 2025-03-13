"use client";

import React, { useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
interface VotesProps {
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
}

const Votes = ({
  upvotes,
  downvotes,
  hasUpvoted,
  hasDownvoted,
}: VotesProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

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
        const successMessage = 
            voteType === "upvote"
            ? `Upvote ${hasUpvoted ? "added" : "removed"} successfully`
            : `Downvote ${hasDownvoted ? "added" : "removed"} successfully`;

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
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
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
          src={hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
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
