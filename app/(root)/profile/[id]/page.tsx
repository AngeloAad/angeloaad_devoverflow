import { getUser } from "@/lib/actions/user.action";
import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;

  if (!id) notFound();

  const loggedInUser = await auth();

  const { success, data, error } = await getUser({ userId: id });

  if (!success || !data) {
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{error?.message}</div>
      </div>
    );
  }

  const { user, totalQuestions, totalAnswers } = data;
  const {
    _id,
    name,
    username,
    bio,
    image,
    location,
    portfolio,
    reputation,
    createdAt,
  } = user;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bolder"
          />

          <div className="mt-3">
            <h1 className="h1-bold text-dark100_light900">{name}</h1>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>

            <div className="mt-5 flex flex-wrap items-start justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  alt="portfolio"
                  title={portfolio}
                  href={portfolio}
                  imgStyles="filter-blue max-sm:w-3 w-4"
                  textStyles="sm:body-medium small-medium text-dark400_light800"
                />
              )}

              {location && (
                <ProfileLink
                  imgUrl="/icons/location.svg"
                  alt="location"
                  title={location}
                  imgStyles="filter-blue max-sm:w-3 w-4"
                  textStyles="sm:body-medium small-medium text-dark400_light800"
                />
              )}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                alt="joined"
                title={dayjs(createdAt).format("MMMM YYYY")}
                imgStyles="filter-blue max-sm:w-3 w-4"
                textStyles="sm:body-medium small-medium text-dark400_light800"
              />
            </div>

            {bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:w-full">
          {loggedInUser?.user?.id === user._id && (
            <Link href="/profile/edit">
              <Button
                className="paragraph-medium btn-secondary
            text-dark300_light900 px-4 py-6"
              >
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />

    </>
  );
};

export default Profile;
