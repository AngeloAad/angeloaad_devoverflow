import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserTags,
  getUserStats,
} from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTION, EMPTY_ANSWER, EMPTY_TAGS } from "@/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
import TagCard from "@/components/cards/TagCard";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

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

  const { user } = data!;
  const { data: userStats } = await getUserStats({ userId: id });

  const {
    success: UserQuestionsSuccess,
    data: UserQuestionsData,
    error: UserQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const {
    success: UserAnswersSuccess,
    data: UserAnswersData,
    error: UserAnswersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const {
    success: UserTagsSuccess,
    data: UserTagsData,
    error: UserTagsError,
  } = await getUserTags({
    userId: id,
  });

  const {
    _id,
    name,
    username,
    bio,
    image,
    location,
    portfolio,
    createdAt,
  } = user;

  const { questions, isNext: hasMoreQuestions } = UserQuestionsData!;
  const { answers, isNext: hasMoreAnswers } = UserAnswersData!;
  const { tags } = UserTagsData!;

  const loggedInUserId = loggedInUser?.user?.id;

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
        totalQuestions={userStats?.questions || 0}
        totalAnswers={userStats?.answers || 0}
        badges={userStats?.badges || {
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
        reputationPoints={userStats?.reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="top-answers" className="tab">
              Top Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              success={UserQuestionsSuccess}
              error={UserQuestionsError}
              data={questions}
              empty={EMPTY_QUESTION}
              render={(questions) =>
                questions.map((question) => (
                  <div
                    key={question._id}
                    className="mt-10 flex w-full flex-col gap-6"
                  >
                    <QuestionCard
                      question={question}
                      showEditButton={true}
                      showDeleteButton={true}
                    />
                  </div>
                ))
              }
            />
            <Pagination
              page={page}
              isNext={hasMoreQuestions || false}
              containerClasses="mt-10"
            />
          </TabsContent>
          <TabsContent
            value="top-answers"
            className="flex w-full flex-col gap-6"
          >
            <DataRenderer
              success={UserAnswersSuccess}
              error={UserAnswersError}
              data={answers}
              empty={EMPTY_ANSWER}
              render={(answers) =>
                answers.map((answer) => {
                  const isAuthor = loggedInUserId === answer.author._id;
                  return (
                    <div
                      key={answer._id}
                      className="mt-10 flex w-full flex-col gap-6"
                    >
                      <AnswerCard
                        {...answer}
                        content={answer.content.slice(0, 27)}
                        showReadMode={true}
                        containerClasses="card-wrapper rounded-[10px] px-7 sm:px-11"
                        showEditButton={isAuthor}
                        showDeleteButton={isAuthor}
                      />
                    </div>
                  );
                })
              }
            />
            <Pagination
              page={page}
              isNext={hasMoreAnswers || false}
              containerClasses="mt-10"
            />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              success={UserTagsSuccess}
              error={UserTagsError}
              data={tags}
              empty={EMPTY_TAGS}
              render={(tags) =>
                tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="mt-10 flex w-full flex-col gap-6"
                  >
                    <TagCard
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.count}
                      showCount={true}
                      compact={true}
                    />
                  </div>
                ))
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
