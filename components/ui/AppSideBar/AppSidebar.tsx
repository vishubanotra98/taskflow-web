"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
import { LayoutDashboard, Users } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppSidebar({ workspaceData }: any) {
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [engineeringOpen, setEngineeringOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Sidebar>
      <Header workspaceData={workspaceData} />

      <SidebarContent>
        <SidebarGroup>
          <Collapsible open={teamsOpen} onOpenChange={setTeamsOpen}>
            <SidebarMenuButton className="sidebar-transition hover:bg-[#1f2937]">
              <span className="flex items-center gap-1.5 text-14-500-primary ">
                <LayoutDashboard size={14} className="mb-0.5" /> Dashboard
              </span>
            </SidebarMenuButton>

            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="sidebar-transition hover:bg-[#1f2937]">
                  <span className="text-14-500-primary flex items-center gap-1.5">
                    <Users size={14} className="mb-0.5" />
                    Teams
                  </span>
                  <span
                    className={`ml-auto chevron-rotate ${teamsOpen ? "open" : ""}`}
                  >
                    <ChevronDown color="#e5e7eb" size={14} />
                  </span>
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="sidebar-transition">
                <ul className="space-y-1 mt-2 ml-2">
                  <li>
                    <Collapsible
                      open={engineeringOpen}
                      onOpenChange={setEngineeringOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="sidebar-item w-full text-left px-3 py-2 rounded-md flex items-center justify-between">
                          <span className="text-14-400-primary">
                            Engineering
                          </span>
                          <span
                            className={`chevron-rotate ${engineeringOpen ? "open" : ""}`}
                          >
                            <ChevronDown color="#e5e7eb" size={12} />
                          </span>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="sidebar-transition ml-3 mt-1">
                        <ul className="space-y-1">
                          <li>
                            <button className="text-white sidebar-item w-full text-left px-3 py-1.5 rounded-md text-sm text-text-secondary">
                              Website Redesign
                            </button>
                          </li>
                          <li>
                            <button className=" text-white sidebar-item w-full text-left px-3 py-1.5 rounded-md text-sm text-text-secondary">
                              Mobile App
                            </button>
                          </li>
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  </li>
                </ul>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <div className="h-px bg-[#1f2937] my-2" />

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between w-full">
          <Avatar className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-200">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="aspect-square h-full w-full object-cover"
            />
            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-slate-400 text-xs font-medium">
              CN
            </AvatarFallback>
          </Avatar>

          <button
            onClick={() => {
              setLoading(true);
              signOut();
              setLoading(false);
            }}
            disabled={loading}
            className="px-3 py-1 text-sm font-bold text-red-700 bg-red-100 border border-red-600 rounded-md hover:bg-red-200 transition-colors"
          >
            {loading ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
