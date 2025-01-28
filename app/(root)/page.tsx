import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

export default async function Home() {
  const session = await auth();

  console.log(session);
  
  return (
    <>
      <h1>Home</h1>

      <form className="px-10 pt-[100px]" action={async () => {
        "use server";

        await signOut({ redirectTo: ROUTES.SIGN_IN });
      }}>
       
      </form>
    </>
  );
}
