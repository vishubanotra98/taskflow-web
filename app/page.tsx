import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      workspaces: {
        include: { workspace: true },
      },
    },
  });

  if (!user?.workspaces || user.workspaces.length === 0) {
    redirect("/onboarding");
  }

  const targetWorkspaceId =
    user.lastActiveWorkspaceId ?? user.workspaces[0].workspaceId;

  redirect(`/${targetWorkspaceId}/dashboard`);
}
