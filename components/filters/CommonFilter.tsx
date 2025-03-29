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
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
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
    let newUrl = "";

    const clearFilter = filters.find((f) => f.name === "Clear");
    const isClearAction = clearFilter && value === clearFilter.value;

    if (isClearAction) {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: value.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  const activeFilterName = filters.find((f) => f.value === filterParams)?.name;

  return (
    <div className={cn("relative", containerClasses)}>
      <Select onValueChange={handleUpdateParams} value={filterParams || ""}>
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
            <SelectValue placeholder="Select a filter">
              {activeFilterName}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent
          className="body-regular no-focus light-border background-light800_dark300 
            text-dark500_light700"
        >
          {filters.map((filter) => (
            <SelectItem
              key={filter.value}
              value={filter.value}
              className={cn(
                "focus:bg-light-800 dark:focus:bg-dark-400 cursor-pointer",
                {
                  "text-sm font-medium text-red-500 hover:!bg-red-500 focus:!bg-red-500/10 dark:hover:!bg-red-500/10 dark:focus:!bg-red-500/10":
                    filter.name === "Clear",
                }
              )}
            >
              {filter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
