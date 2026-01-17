import { logOutAction } from "@/actions/auth.actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return (
    <div>
      <div className="header h-[60px] bg-primary flex justify-between items-center">
        <form action={logOutAction}>
          <button className="button-primary px-3 mt-0">Logout</button>
        </form>
      </div>
    </div>
  );
}
