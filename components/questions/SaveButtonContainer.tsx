"use client";

import React, { Suspense } from "react";
import SaveQuestions from "./SaveQuestions";
import SaveQuestionsSkeleton from "./SaveQuestionsSkeleton";

interface SaveButtonContainerProps {
  questionId: string;
  getSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SaveButtonContainer = ({
  questionId,
  getSavedQuestionPromise,
}: SaveButtonContainerProps) => {
  return (
    <Suspense fallback={<SaveQuestionsSkeleton />}>
      <SaveQuestions
        questionId={questionId}
        getSavedQuestionPromise={getSavedQuestionPromise}
      />
    </Suspense>
  );
};

export default SaveButtonContainer;