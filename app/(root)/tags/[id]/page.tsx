import HomeFilter from '@/components/filters/HomeFilter';
import DataRenderer from '@/components/DataRenderer';
import QuestionCard from '@/components/cards/QuestionCard';
import { EMPTY_QUESTION } from '@/constants/states';
import { getTagQuestions } from '@/lib/actions/tag.action';
import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ROUTES from '@/constants/routes';
import LocalSearch from '@/components/search/LocalSearch';

const page = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: parseInt(page) || 1,
    pageSize: parseInt(pageSize) || 10,
    query,
  });

  const { tag, questions } = data || {};
  
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          questions.map((question) => (
            <div key={question._id} className="mt-10 flex w-full flex-col gap-6">
              <QuestionCard question={question} />
            </div>
          ))
        )}
      />
    </>
  );
};

export default page;
