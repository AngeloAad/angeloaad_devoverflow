"use client";

import { use, useState, useOptimistic, startTransition } from "react";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface SaveQuestionsProps {
  questionId: string;
  getSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SaveQuestions = ({
  questionId,
  getSavedQuestionPromise,
}: SaveQuestionsProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(getSavedQuestionPromise);
  const initialIsSaved = data?.saved ?? false;

  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const [optimisticIsSaved, addOptimisticSaved] = useOptimistic(
    isSaved,
    (state, newState: boolean) => newState
  );

  const handleSaveQuestion = async () => {
    if (!userId) {
      return toast({
        title: "Please log in to save question",
        description: "You must be logged in to save question",
        variant: "destructive",
      });
    }

    startTransition(() => {
      addOptimisticSaved(!isSaved);
    });

    try {
      const { success, data, error } = await toggleSaveQuestion({
        questionId,
      });

      if (!success) {
        return toast({
          title: "Failed to save question",
          description:
            error?.message ||
            "An error occurred while saving question, please try again.",
          variant: "destructive",
        });
      }

      setIsSaved(data?.saved ?? false);

      toast({
        title: `Question ${data?.saved ? "saved" : "unsaved"} successfully`,
      });
    } catch (error) {
      return toast({
        title: "Failed to save question",
        description:
          "An error occurred while saving question, please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Image
      src={optimisticIsSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      alt="save"
      width={20}
      height={20}
      className={`cursor-pointer`}
      aria-label="Save question"
      onClick={handleSaveQuestion}
    />
  );
};

export default SaveQuestions;
