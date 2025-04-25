import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );
};

export default Loading;
