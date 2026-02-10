"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { FolderKanban } from "lucide-react";
import { useParams } from "next/navigation";
import { CreateWorkspaceModal } from "@/components/Forms/OnboardingForm/OnboardingForm";
import Link from "next/link";

const Header = ({ userData }: any) => {
  const [open, setOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (params?.workspaceId) {
      setOpen(true);
    }
  }, [params?.workspaceId]);

  const workspaceData = userData?.workspaces;

  return (
    <>
      <SidebarHeader>
        <span className="mt-2 text-18-500-primary mb-2">TaskFlow</span>

        <SidebarMenu>
          <Collapsible open={open} onOpenChange={setOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="sidebar-transition hover:bg-[#1f2937]">
                  <span className="text-14-500-primary flex items-center gap-1.5">
                    <FolderKanban size={14} className="mb-0.5" />
                    Workspaces
                  </span>
                  <span
                    className={`ml-auto chevron-rotate ${open ? "open" : ""}`}
                  >
                    <ChevronDown color="#e5e7eb" size={14} />
                  </span>
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="sidebar-transition">
                <ul className="space-y-1 mt-2">
                  {workspaceData?.map((wsData: any, idx: any) => {
                    const activeWs =
                      wsData?.workspaceId === params?.workspaceId;

                    return (
                      <Link
                        href={`/${wsData?.workspace?.id}/dashboard`}
                        key={wsData?.workspace?.id}
                        className={`sidebar-item block px-3 py-2 rounded-md ${
                          activeWs
                            ? "sidebar-item-active"
                            : "hover:bg-[#1f2937]"
                        }`}
                      >
                        <span className="text-14-400-primary">
                          {wsData?.workspace?.name}
                        </span>
                      </Link>
                    );
                  })}

                  <div className="h-px bg-[#1f2937] my-2" />

                  <li className="">
                    <CreateWorkspaceModal userId={userData?.id} />
                  </li>
                </ul>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarHeader>
      <div className="h-px bg-[#1f2937] my-2" />
    </>
  );
};

export default Header;
