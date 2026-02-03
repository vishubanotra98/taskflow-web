"use client";

import { useState } from "react";
import { ChevronDown, CirclePlus } from "lucide-react";
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

const Header = () => {
  const [open, setOpen] = useState(false);

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
                    <FolderKanban size={14} className="mb-0.5" /> Vishu's
                    Workspace
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
                  <li>
                    <button className="sidebar-item w-full text-left px-3 py-2 rounded-md">
                      <span className="text-14-400-primary">Workspace 1</span>
                    </button>
                  </li>

                  <li>
                    <button className="sidebar-item w-full text-left px-3 py-2 rounded-md">
                      <span className="text-14-400-primary">Workspace 2</span>
                    </button>
                  </li>

                  <div className="h-px bg-[#1f2937] my-2" />

                  <li className="">
                    <button className="sidebar-item w-full text-left px-3 py-2 rounded-md">
                      <span className="flex gap-1.5 items-center">
                        <CirclePlus color="#e5e7eb" size={15} />
                        <span className="text-14-400-primary">
                          Add New Workspace
                        </span>
                      </span>
                    </button>
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
