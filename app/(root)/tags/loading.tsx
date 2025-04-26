import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      {/* Page heading */}
      <Skeleton className="h-10 w-32" />

      {/* Search and filter section */}
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="background-light800_darkgradient h-14 flex-1 rounded-[10px]" />
        <Skeleton className="background-light800_dark300 min-h-[56px] sm:min-w-[170px] rounded-[10px]" />
      </section>

      {/* Tags grid */}
      <div className="mt-10 flex w-full flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <article
            key={item}
            className="background-light900_dark200 light-border flex
            w-full flex-col rounded-[10px] border px-8 py-10 sm:w-[260px]"
          >
            {/* Tag header with name and icon */}
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="background-light800_dark400 h-7 w-24 rounded-sm" />
              <Skeleton className="h-6 w-6 rounded-sm" />
            </div>

            {/* Tag description */}
            <div className="mt-5 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>

            {/* Question count */}
            <div className="mt-3.5 flex items-center">
              <Skeleton className="h-5 w-16 mr-2.5" />
              <Skeleton className="h-5 w-20" />
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex gap-3 justify-center">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-20" />
      </div>
    </>
  );
};

export default Loading;
