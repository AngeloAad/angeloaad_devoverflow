"use client";

import React from "react";

const SaveQuestionsSkeleton = () => {
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        {/* Save icon skeleton */}
        <div className="w-[20px] h-[20px] background-light700_dark400 rounded-full" />
      </div>
    </div>
  );
};

export default SaveQuestionsSkeleton;