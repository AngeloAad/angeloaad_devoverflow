import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imgStyles?: string;
  isAuthor?: boolean;
  titleStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  isAuthor,
  titleStyles,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`rounded-full object-contain ${imgStyles}`}
        style={{ fill: "blue" }}
      />

      <p className={`${textStyles} flex-center gap-1`}>
        {value}

        {title ? (
          <span
            className={cn(`small-regular line-clamp-1`, titleStyles)}
          >
          {title}
        </span>
        ) : null}
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">{metricContent}</Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
