"use client";

import { use, useState, useOptimistic, startTransition } from "react";
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

// Simplified vote state
interface VoteState {
  upvotes: number;
  downvotes: number;
  upvoted: boolean;
  downvoted: boolean;
}

const Votes = ({
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  actionType,
  actionId,
  getVotePromise,
}: VotesProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  // Get initial data from the server
  const { success, data } = use(getVotePromise);
  const { upvoted = false, downvoted = false } = data || {};

  // Create a single source of truth for vote state
  const [voteState, setVoteState] = useState<VoteState>({
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
    upvoted,
    downvoted,
  });

  // Optimistic update function to handle vote changes
  const [optimisticVoteState, addOptimisticVote] = useOptimistic(
    voteState,
    (state, voteType: "upvote" | "downvote") => {
      // Create a new state object
      const newState = { ...state };

      if (voteType === "upvote") {
        if (state.upvoted) {
          // Remove upvote
          newState.upvotes -= 1;
          newState.upvoted = false;
        } else {
          // Add upvote
          newState.upvotes += 1;
          newState.upvoted = true;

          // Remove downvote if exists
          if (state.downvoted) {
            newState.downvotes -= 1;
            newState.downvoted = false;
          }
        }
      } else {
        if (state.downvoted) {
          // Remove downvote
          newState.downvotes -= 1;
          newState.downvoted = false;
        } else {
          // Add downvote
          newState.downvotes += 1;
          newState.downvoted = true;

          // Remove upvote if exists
          if (state.upvoted) {
            newState.upvotes -= 1;
            newState.upvoted = false;
          }
        }
      }

      return newState;
    }
  );

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast({
        title: "Please log in to vote",
        description: "You must be logged in to vote",
        variant: "destructive",
      });
    }

    setIsLoading(true);

    // Apply optimistic update
    startTransition(() => {
      addOptimisticVote(voteType);
    });

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

      // Update the actual state to match our optimistic state
      setVoteState((current) => {
        const newState = { ...current };

        if (voteType === "upvote") {
          if (current.upvoted) {
            newState.upvotes -= 1;
            newState.upvoted = false;
          } else {
            newState.upvotes += 1;
            newState.upvoted = true;

            if (current.downvoted) {
              newState.downvotes -= 1;
              newState.downvoted = false;
            }
          }
        } else {
          if (current.downvoted) {
            newState.downvotes -= 1;
            newState.downvoted = false;
          } else {
            newState.downvotes += 1;
            newState.downvoted = true;

            if (current.upvoted) {
              newState.upvotes -= 1;
              newState.upvoted = false;
            }
          }
        }

        return newState;
      });

      // Create success message
      const isAdding =
        voteType === "upvote" ? !voteState.upvoted : !voteState.downvoted;

      const successMessage = `${
        voteType === "upvote" ? "Upvote" : "Downvote"
      } ${isAdding ? "added" : "removed"} successfully`;

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
          src={
            optimisticVoteState.upvoted
              ? "/icons/upvoted.svg"
              : "/icons/upvote.svg"
          }
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(optimisticVoteState.upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            optimisticVoteState.downvoted
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
            {formatNumber(optimisticVoteState.downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
