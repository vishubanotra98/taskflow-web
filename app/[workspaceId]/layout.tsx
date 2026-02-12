import { auth } from "@/lib/auth";
import { NAV_ITEMS } from "@/utils/constants";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/AppSideBar/AppSidebar";
import prisma from "@/lib/prisma";

export default async function MainLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: any }>) {
  const wsParams = await params;
  const session = await auth();
  if (!session) redirect("/sign-in");

  if (session?.user?.id) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        lastActiveWorkspaceId: wsParams.workspaceId,
      },
    });
  }

  const workspaces = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    include: { workspaces: { include: { workspace: true } } },
  });

  const teams = await prisma.team.findMany({
    where: {
      workspaceId: wsParams?.workspaceID,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <SidebarProvider>
        <AppSidebar teams={teams} workspaceData={workspaces} />
        <main className="py-3 px-4 w-full bg-primary-2">
          <SidebarTrigger className=" cursor-pointer bg-transparent hover:bg-[#1f2937]" />

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
