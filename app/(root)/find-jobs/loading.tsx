import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="flex flex-col gap-8 w-full">
      {/* Page heading */}
      <Skeleton className="h-10 w-48" />

      {/* JobsFilter section */}
      <div className="relative mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        {/* Search bar */}
        <Skeleton className="h-14 flex-1 max-sm:w-full rounded-lg" />
        {/* Location dropdown */}
        <Skeleton className="h-14 sm:max-w-[210px] w-full rounded-lg" />
      </div>

      {/* JobCard list section */}
      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {/* Multiple job card skeletons */}
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8"
          >
            {/* Mobile location badge */}
            <div className="flex w-full justify-end sm:hidden">
              <Skeleton className="h-8 w-28 rounded-2xl" />
            </div>

            {/* Company logo */}
            <Skeleton className="size-16 rounded-xl" />

            <div className="w-full">
              {/* Title and location */}
              <div className="flex-between flex-wrap gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-32 rounded-2xl hidden sm:flex" />
              </div>

              {/* Description */}
              <div className="mt-2">
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>

              {/* Bottom actions */}
              <div className="flex-between mt-8 flex-wrap gap-6">
                <div className="flex flex-wrap items-center gap-6">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-28" />
      </div>
    </section>
  );
};

export default Loading;
