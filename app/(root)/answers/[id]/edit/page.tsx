import { auth } from "@/auth";
import AnswerForm from "@/components/forms/AnswerForm";
import ROUTES from "@/constants/routes";
import { getAnswer } from "@/lib/actions/answer.action";
import { notFound, redirect } from "next/navigation";
import React from "react";

const EditAnswer = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: answer, success } = await getAnswer({ answerId: id });
  if (!success || !answer) return notFound();

  if (answer.author._id !== session?.user?.id) redirect(ROUTES.HOME);

  return (
    <div>
      <AnswerForm
        questionId={answer.question._id}
        questionTitle={answer.question.title}
        questionContent={answer.question.content}
        answer={answer}
        isEdit
      />
    </div>
  );
};

export default EditAnswer;
