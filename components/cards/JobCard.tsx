import Image from "next/image";
import Link from "next/link";
import React from "react";
import ROUTES from "@/constants/routes";
import Metric from "@/components/Metric";

interface JobProps {
  _id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  description: string;
  location: string;
  jobType: string;
  category: string;
  salary: string;
}

interface JobCardProps {
  job: JobProps;
}

const JobCard = ({ job }: JobCardProps) => {
  const {
    _id,
    title,
    companyName,
    companyLogo,
    description,
    location,
    jobType,
    category,
    salary,
  } = job;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex w-full gap-4 max-sm:flex-col">
          <div className="flex-shrink-0 max-sm:self-center">
            <Image
              src={companyLogo || "/icons/company-logo.svg"}
              alt={companyName}
              width={60}
              height={60}
              className="rounded-md object-contain"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:mt-4">
              <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 pr-4">
                {title}
              </h3>

              <div className="flex items-center justify-center gap-3 background-light800_dark400 p-1 rounded-full max-md:hidden">
                <span className="flex items-center gap-2">
                  <Image
                    src="/icons/location.svg"
                    alt="location"
                    width={20}
                    height={20}
                  />
                  <p className="body-medium text-dark400_light700 pr-1">
                    {location}
                  </p>
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3 flex-wrap py-2">
              <div className="flex items-center justify-center gap-3 background-light800_dark400 p-1 rounded-full md:hidden">
                <span className="flex items-center gap-2">
                  <Image
                    src="/icons/location.svg"
                    alt="location"
                    width={20}
                    height={20}
                  />
                  <p className="body-medium text-dark400_light700 pr-1">
                    {location}
                  </p>
                </span>
              </div>

              <span className="subtle-medium background-light800_dark400 text-light400_light500 rounded-md px-4 py-2 uppercase">
                {category}
              </span>
            </div>

            <div className="mt-3.5">
              <p className="body-regular text-dark400_light700">
                About the Company: {description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-wrap">
                <Metric
                  imgUrl="/icons/clock-2.svg"
                  alt="Job Type"
                  value={jobType}
                  title=""
                  textStyles="small-medium text-light400_light500"
                />

                <Metric
                  imgUrl="/icons/currency-dollar-circle.svg"
                  alt="Salary"
                  value={salary}
                  title=""
                  textStyles="small-medium text-light400_light500"
                />
              </div>

              <Link
                href={`${ROUTES.JOBS}?id=${_id}`}
                className="flex items-center gap-2 ml-auto"
              >
                <p className="body-semibold primary-text-gradient">View job</p>
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt="arrow right"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
