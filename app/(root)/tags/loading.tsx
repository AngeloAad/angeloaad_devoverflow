import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton className="h-10 w-32" />

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="min-h-[56px] sm:min-w-[170px]" />
      </section>

      <div className="mt-10 flex w-full flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="h-40 w-full rounded-2xl xs:w-[180px]"
          />
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
