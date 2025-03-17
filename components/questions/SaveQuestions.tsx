"use client";

import { use, useState } from "react";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface SaveQuestionsProps {
  questionId: string;
  getSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SaveQuestions = ({ questionId, getSavedQuestionPromise }: SaveQuestionsProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(getSavedQuestionPromise);
  const { saved } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveQuestion = async () => {
    if (!userId) {
      return toast({
        title: "Please log in to save question",
        description: "You must be logged in to save question",
        variant: "destructive",
      });
    }

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={saved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      alt="save"
      width={20}
      height={20}
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSaveQuestion}
    />
  );
};

export default SaveQuestions;
