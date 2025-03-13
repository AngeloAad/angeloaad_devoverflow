"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AnswerSchema } from "@/lib/validations";
import { createAnswer } from "@/lib/actions/answer.action";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import DynamicEditor from "@/components/editor/DynamicEditor";

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: AnswerFormProps) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();

        toast({
          title: "Success",
          description: "Your answer has been posted successfully",
        });

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      toast({
        title: "Please log in",
        description: "You must be logged in to use this feature",
      });
      return;
    }

    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!success) {
        return toast({
          title: "Error",
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
      }

      const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();

      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);
        form.setValue("content", formattedAnswer);
        form.trigger("content");
      }

      toast({
        title: "Success",
        description: "AI answer generated successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem generating the answer",
        variant: "destructive",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border-2 py-[0.5px]">
                  <DynamicEditor
                    value={field.value}
                    fieldChange={field.onChange}
                    ref={editorRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit !text-light-900"
            >
              {isAnswering ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
