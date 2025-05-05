import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      {/* Tag title */}
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-40" />
      </section>

      {/* Search and filter section */}
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1 rounded-[10px]" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px] rounded-[10px]" />
      </section>

      {/* Questions list */}
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="mt-10 flex w-full flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ))}

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
