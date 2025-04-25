import { Skeleton } from "@/components/ui/skeleton";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";

const Loading = () => {
  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="size-[140px] rounded-full" />

          <div className="mt-3">
            <Skeleton className="h-10 w-40 mb-2" />
            <Skeleton className="h-5 w-28" />

            <div className="mt-5 flex flex-wrap items-start justify-start gap-5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>

            <Skeleton className="paragraph-regular mt-8 h-20 w-full" />
          </div>
        </div>

        <div className="flex justify-end max-sm:w-full">
          <Skeleton className="h-11 w-28" />
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-5">
        <Skeleton className="h-20 w-full xs:w-[200px]" />
        <Skeleton className="h-20 w-full xs:w-[200px]" />
        <Skeleton className="h-20 w-full xs:w-[200px]" />
        <Skeleton className="h-20 w-full xs:w-[200px]" />
      </div>

      <section className="mt-10 flex gap-10">
        <div className="flex-[2]">
          <Skeleton className="h-[42px] w-full mb-5" />

          <div className="mt-5 flex w-full flex-col gap-6">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-48 w-full rounded-xl" />
            ))}
          </div>

          <div className="mt-10 flex gap-3 justify-center">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
      </section>
    </>
  );
};

export default Loading;
