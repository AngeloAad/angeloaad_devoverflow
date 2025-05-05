import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      {/* Header */}
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      {/* Profile Form Skeleton */}
      <div className="mt-9 flex flex-col gap-9">
        {/* Form fields */}
        <div className="flex flex-col gap-6">
          {/* Name field */}
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Username field */}
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Bio field */}
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Location field */}
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="h-6 w-22" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Portfolio URL field */}
          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </>
  );
};

export default Loading;
