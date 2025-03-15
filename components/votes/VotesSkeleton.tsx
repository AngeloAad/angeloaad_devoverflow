"use client";

import React from "react";

const VotesSkeleton = () => {
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        {/* Upvote icon skeleton */}
        <div className="w-[18px] h-[18px] background-light700_dark400 rounded-sm" />
        
        {/* Upvote count skeleton */}
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <div className="w-3 h-3" />
        </div>
      </div>

      <div className="flex-center gap-1.5">
        {/* Downvote icon skeleton */}
        <div className="w-[18px] h-[18px] background-light700_dark400 rounded-sm" />
        
        {/* Downvote count skeleton */}
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <div className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default VotesSkeleton;