import HomeFilter from "@/components/filters/HomeFilter";
import DataRenderer from "@/components/DataRenderer";
import QuestionCard from "@/components/cards/QuestionCard";
import { EMPTY_QUESTION } from "@/constants/states";
import { getTagQuestions } from "@/lib/actions/tag.action";
import React from "react";
import ROUTES from "@/constants/routes";
import LocalSearch from "@/components/search/LocalSearch";
import CommonFilter from "@/components/filters/CommonFilter";
import { TagFilters } from "@/constants/filters";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";

const page = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: parseInt(page) || 1,
    pageSize: parseInt(pageSize) || 10,
    query,
  });

  const { tag, questions, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) =>
          questions.map((question) => (
            <div
              key={question._id}
              className="mt-10 flex w-full flex-col gap-6"
            >
              <QuestionCard question={question} />
            </div>
          ))
        }
      />

      <Pagination
        page={page}
        isNext={isNext || false}
        containerClasses="mt-10"
      />
    </>
  );
};

export default page;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data } = await getTagQuestions({ tagId: params.id });

  if (!data?.tag) {
    return {
      title: "Tag Not Found",
    };
  }

  const { tag, questions } = data;

  return {
    title: `${tag.name} Questions`,
    description: `Find answers to ${tag.name} programming questions. Browse ${questions.length}+ questions or ask your own.`,
    keywords: [
      `${tag.name}`,
      "programming",
      "coding",
      "development",
      `${tag.name} questions`,
    ],
    openGraph: {
      title: `${tag.name} Questions | DevOverflow`,
      description: `Find answers to ${tag.name} programming questions. Browse ${questions.length}+ questions or ask your own.`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${tag.name} Questions | DevOverflow`,
      description: `Find answers to ${tag.name} programming questions. Browse ${questions.length}+ questions or ask your own.`,
    },
  };
}
