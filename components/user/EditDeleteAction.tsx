"use client";

import { deleteQuestion } from "@/lib/actions/question.action";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteAnswer, editAnswer } from "@/lib/actions/answer.action";
interface Props {
  type: "Question" | "Answer";
  itemId: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

const EditDeleteAction = ({
  type,
  itemId,
  showEditButton,
  showDeleteButton,
}: Props) => {
  const router = useRouter();

  const handleEdit = async () => {
    if (type === "Question") {
      router.push(`/questions/${itemId}/edit`);
    } else if (type === "Answer") {
      await editAnswer({ answerId: itemId, content: "", questionId: "" });
    }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: itemId });

      toast({
        title: "Question Deleted",
        variant: "destructive",
        description: "Your question has been successfully deleted.",
      });
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: itemId });

      toast({
        title: "Answer Deleted",
        variant: "destructive",
        description: "Your answer has been successfully deleted.",
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full cursor-pointer">
      {showEditButton && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={16}
          height={16}
          onClick={handleEdit}
        />
      )}
      {showDeleteButton && (
        <Image
          src="/icons/trash.svg"
          alt="delete"
          width={16}
          height={16}
          onClick={handleDelete}
        />
      )}
    </div>
  );
};

export default EditDeleteAction;
