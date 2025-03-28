import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import UserCard from "@/components/cards/UserCard";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { users, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <section className="mt-11 mb-12">
        <LocalSearch
          route={ROUTES.COMMUNITIES}
          imgSrc="/icons/search.svg"
          placeholder="Search users..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="flex w-full flex-wrap gap-4 max-[585px]:flex-col max-[585px]:items-center">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Community;
