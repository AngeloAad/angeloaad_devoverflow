"use client";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formUrlQuery } from "@/lib/url";
import { Filter } from "lucide-react";

interface CommonFilterProps {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
}

const CommonFilter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
}: CommonFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={cn("relative", containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={filterParams || undefined}
      >
        <SelectTrigger
          className={cn(
            `body-regular light-border background-light800_dark300 
            text-dark500_light700 px-5 py-2.5 focus:outline-none focus:ring-0`,
            otherClasses
          )}
          aria-label="Filter Options"
        >
          <div className="flex items-center gap-2">
            <Filter className="size-4" />
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent
          className="body-regular no-focus light-border background-light800_dark300 
            text-dark500_light700"
        >
          {filters.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
