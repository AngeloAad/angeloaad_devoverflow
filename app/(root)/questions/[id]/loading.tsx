import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex flex-col-reverse w-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Skeleton className="size-[22px] rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>

        <Skeleton className="h2-semibold mt-3.5 h-8 w-full" />
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-28" />
      </div>

      <Skeleton className="h-60 w-full rounded-xl" />

      <div className="mt-8 flex flex-wrap gap-2">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-7 w-20 rounded-md" />
        ))}
      </div>

      <section className="my-10">
        <Skeleton className="h-10 w-32 mb-5" />

        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 w-full rounded-xl" />
          ))}
        </div>

        <div className="mt-10 flex gap-3 justify-center">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </section>

      <section className="my-10">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-10 w-32 mt-4 self-end ml-auto" />
      </section>
    </>
  );
};

export default Loading;
