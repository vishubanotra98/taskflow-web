import { auth } from "@/lib/auth";
import { NAV_ITEMS } from "@/utils/constants";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/AppSideBar/AppSidebar";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="py-3 px-4 w-full bg-primary-2">
          <SidebarTrigger className=" cursor-pointer bg-transparent hover:bg-[#1f2937]" />

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
