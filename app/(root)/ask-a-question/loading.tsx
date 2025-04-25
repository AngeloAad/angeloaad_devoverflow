import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton className="h-10 w-48" />

      <div className="mt-9 flex flex-col gap-8">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-10 w-32 self-end" />
      </div>
    </>
  );
};

export default Loading;
