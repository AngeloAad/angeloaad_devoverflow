import React from "react";
import { Metadata } from "next";
import Pagination from "@/components/Pagination";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { JobFilters } from "@/constants/filters";
import JobCard from "@/components/cards/JobCard";

export const metadata: Metadata = {
  title: "DevFlow | Find Jobs",
  description:
    "Find programming and development job opportunities. Browse job listings for developers, engineers, and tech professionals.",
};

// Sample jobs data for demonstration
const SAMPLE_JOBS = [
  {
    _id: "1",
    title: "Principal Salesforce Developer",
    companyName: "AT&T",
    companyLogo: "/images/site-logo.svg",
    description:
      "Join AT&T and reimagine the communications and technologies that connect the world.",
    location: "Melbourne, AU",
    jobType: "Full-time",
    category: "DEVELOPMENT",
    salary: "80k - 100k",
  },
  {
    _id: "2",
    title: "Senior React Developer",
    companyName: "Microsoft",
    companyLogo: "/images/companies/microsoft.png",
    description:
      "Join our team building the next generation of web applications.",
    location: "Seattle, WA",
    jobType: "Full-time",
    category: "DEVELOPMENT",
    salary: "120k - 150k",
  },
  {
    _id: "3",
    title: "DevOps Engineer",
    companyName: "Google",
    companyLogo: "/images/companies/google.png",
    description: "Help us build and maintain our cloud infrastructure.",
    location: "San Francisco, CA",
    jobType: "Full-time",
    category: "INFRASTRUCTURE",
    salary: "130k - 160k",
  },
];

const FindJobs = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = (await searchParams) || {};

  // For now, we're using sample data
  // In a real implementation, you would fetch jobs from an API
  const jobs = SAMPLE_JOBS;
  const isNext = false;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Find Jobs</h1>
      <section className="mt-11 mb-12 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.JOBS}
          imgSrc="/icons/search.svg"
          placeholder="Search jobs..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={JobFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>

      <div className="flex flex-col gap-6 mt-10">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      <Pagination
        page={Number(page) || 1}
        isNext={isNext}
        containerClasses="mt-10"
      />
    </>
  );
};

export default FindJobs;
