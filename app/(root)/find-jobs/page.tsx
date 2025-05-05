import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/filters/JobFilter";
import Pagination from "@/components/Pagination";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";
import { unstable_cache } from "next/cache";

// Cache the job fetching for 5 minutes
const getCachedJobs = unstable_cache(
  async (query: string, page: number) => {
    return fetchJobs({ query, page });
  },
  ["jobs-cache"],
  { revalidate: 300 } // 5 minutes
);

interface PageProps {
  searchParams: {
    query?: string;
    location?: string;
    page?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { query, location, page } = searchParams;
  const pageNum = Number(page ?? 1);

  try {
    // Fetch data in parallel
    const [locationData, countriesData] = await Promise.all([
      fetchLocation(),
      fetchCountries(),
    ]);

    // Sort countries alphabetically
    const sortedCountries = [...countriesData].sort((a, b) => {
      const nameA = a.name.common || "";
      const nameB = b.name.common || "";
      return nameA.localeCompare(nameB);
    });

    // Construct search query
    const searchQuery =
      query && location
        ? `${query}, ${location}`
        : `Software Engineer in ${locationData}`;

    // Fetch jobs with caching
    const jobs = await getCachedJobs(searchQuery, pageNum);

    return (
      <>
        <h1 className="h1-bold text-dark100_light900">Jobs</h1>

        <div className="flex">
          <JobsFilter countriesList={sortedCountries} />
        </div>

        <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
          {jobs?.length > 0 ? (
            jobs
              ?.filter((job: Job) => job.job_title)
              .map((job: Job, index: number) => (
                <div
                  key={`${job.id}-${index}`}
                  className="flex w-full flex-col gap-6"
                >
                  <JobCard job={job} />
                </div>
              ))
          ) : (
            <div className="paragraph-regular text-dark200_light800 w-full text-center">
              Oops! We couldn&apos;t find any jobs at the moment. Please try
              again later
            </div>
          )}
        </section>

        {jobs?.length > 0 && (
          <Pagination page={pageNum} isNext={jobs?.length === 10} />
        )}
      </>
    );
  } catch (error: any) {
    // Handle rate limiting and other errors
    const errorMessage =
      error.message === "too many requests"
        ? "We've hit the API rate limit. Please try again in a few minutes."
        : "Something went wrong while fetching jobs. Please try again later.";

    return (
      <>
        <h1 className="h1-bold text-dark100_light900">Jobs</h1>

        <div className="flex">
          <JobsFilter countriesList={[]} />
        </div>

        <div className="flex-center min-h-[200px] w-full">
          <p className="text-dark200_light800 text-center">{errorMessage}</p>
        </div>
      </>
    );
  }
};

export default Page;
