"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/url";
interface PaginationProps {
  page: number | undefined | string;
  isNext: boolean;
  containerClasses?: string;
}

const Pagination = ({
  page = 1,
  isNext = false,
  containerClasses,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    // update URL
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-8",
        containerClasses
      )}
    >
      {/* Previous Page Button */}
      {Number(page) > 1 && (
        <Button
          className="flex w-fit items-center justify-center"
          // size="icon"
          variant="ghost"
          onClick={() => handleNavigation("prev")}
        >
          <ChevronLeftIcon size={16} className="text-dark200_light800" />
          <p className="body-medium text-dark200_light800">Previous</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {/* Next Page Button */}
      {isNext && (
        <Button
          className="flex w-fit items-center justify-center"
          // size="icon"
          variant="ghost"
          onClick={() => handleNavigation("next")}
        >
          <p className="body-medium text-dark200_light800">Next</p>
          <ChevronRightIcon spacing={4} className="text-dark200_light800" />
        </Button>
      )}
    </div>
  );
};

export default Pagination;
