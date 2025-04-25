import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Loading = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[46px] w-36" />
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </section>

      <div className="my-5 flex-wrap gap-5 md:flex">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="mb-5 h-9 w-full md:w-24" />
        ))}
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-xl" />
        ))}
      </div>

      <div className="mt-10 flex gap-3 justify-center">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </>
  );
};

export default Loading;
