"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Header from "./Header";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { signOut } from "next-auth/react";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Modal } from "@/components/Common/Modal";
import { CreateProjectModal } from "@/components/Forms/ProjectForm/ProjectForm";

export function AppSidebar({ workspaceData, teams }: any) {
  const [teamsOpen, setTeamsOpen] = useState(true); // Default to open for better UX
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathName = usePathname();

  const isActiveItem = (key: string) => pathName.includes(key);

  return (
    <Sidebar>
      <Header userData={workspaceData} />

      <SidebarContent className="gap-0">
        <SidebarGroup>
          {/* 1. Dashboard Link (Moved outside of Teams Collapsible) */}
          <SidebarMenuButton
            onClick={() => router.push(`/${params?.workspaceId}/dashboard`)}
            className={`w-full justify-start py-6 px-4 hover:bg-[#1f2937] transition-colors mb-1 ${
              isActiveItem("dashboard") ? "bg-[#1f2937]" : ""
            }`}
          >
            <LayoutDashboard size={18} className="mr-2 text-[#6b7280]" />
            <span className="text-sm font-medium text-[#e5e7eb]">
              Dashboard
            </span>
          </SidebarMenuButton>

          {/* 2. Teams Group */}
          <Collapsible
            open={teamsOpen}
            onOpenChange={setTeamsOpen}
            className="mt-2"
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full justify-between py-6 px-4 hover:bg-[#1f2937] transition-colors group">
                <div className="flex items-center">
                  <Users size={18} className="mr-2 text-[#6b7280]" />
                  <span className="text-sm font-medium text-[#e5e7eb]">
                    Teams
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-[#6b7280] transition-transform duration-200 ${
                    teamsOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <ul className="flex flex-col gap-1 mt-1 px-2">
                {teams?.map((team: any) => (
                  <TeamItem key={team.id} team={team} params={params} />
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <div className="h-px bg-[#1f2937] mx-4 my-2 opacity-50" />

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#1f2937] transition-colors">
          <Avatar className="h-8 w-8 rounded-full border border-[#1f2937] bg-[#111827] shrink-0">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="object-cover rounded-full"
            />
            <AvatarFallback className="rounded-full text-[#e5e7eb]">
              CN
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-[#e5e7eb]">
              User Name
            </p>
            <button
              onClick={() => {
                setLoading(true);
                signOut();
              }}
              disabled={loading}
              className="text-xs text-[#6b7280] hover:text-red-500 transition-colors text-left"
            >
              {loading ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function TeamItem({ team, params }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <li>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full p-2 rounded-md hover:bg-[#1f2937] transition-colors group">
            <span className="flex items-center text-sm text-[#e5e7eb]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3" />
              {team?.name}
            </span>
            <ChevronRight
              size={14}
              className={`text-[#6b7280] transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="pl-4 pr-1 pb-2 pt-1">
          {/* Projects Divider - MOVED INSIDE THE TEAM */}
          <div className="flex items-center my-2 opacity-60">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6b7280]">
              Projects
            </span>
            <span className="h-[1px] flex-1 bg-[#374151] ml-2"></span>
          </div>

          <ul className="space-y-0.5 border-l border-[#1f2937] ml-1 pl-3">
            {/* Project List */}
            <li>
              <Link
                href={`/${params?.workspaceId}/project/example-id`}
                className="block text-sm text-[#6b7280] hover:text-[#e5e7eb] py-1.5 transition-colors"
              >
                Website Redesign
              </Link>
            </li>

            <li className="pt-1">
              <Modal
                open={isModalOpen}
                setOpen={() => setIsModalOpen((prev) => !prev)}
                title="Create Project"
                body={<CreateProjectModal teamId={team?.id} />}
                buttonClassName="w-full"
                buttonInnerText={
                  <div className="flex items-center text-xs  transition-colors cursor-pointer py-1">
                    <Plus size={12} className="mr-2" />
                    Create Project
                  </div>
                }
              />
            </li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}


