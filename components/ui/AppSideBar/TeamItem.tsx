"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FolderKanban, Plus, Users } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Modal } from "@/components/Common/Modal";
import { CreateProjectModal } from "@/components/Forms/ProjectForm";
import { ProjectItem, TeamItemProps } from "@/types/types";

function TeamItem({ team, params, isAdmin }: TeamItemProps) {
  const { state, setOpen } = useSidebar();

  const isCollapsed = state === "collapsed";

  const activeProjectId = String(params?.projectId ?? "");
  const projects = team.projects ?? [];

  const containsActiveProject = projects.some(
    (project: ProjectItem) => project.id === activeProjectId,
  );

  const [isOpen, setIsOpen] = useState(containsActiveProject);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isCollapsed) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            tooltip={team.name}
            isActive={containsActiveProject}
            onClick={() => {
              setOpen(true);
              setIsOpen(true);
            }}
            className={`h-9 rounded-lg transition-colors duration-150 ${containsActiveProject ? "bg-accent text-primary" : "text-secondary hover:bg-accent hover:text-primary"}`}
          >
            <Users
              className={`
                size-4
                ${containsActiveProject ? "text-brand" : "text-secondary"}
              `}
            />

            <span>{team.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="group/team">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={`flex h-9 w-full items-center gap-2 rounded-lg px-2 text-sm transition-colors duration-150 cursor-pointer ${containsActiveProject ? "bg-accent text-primary" : "text-secondary hover:bg-accent hover:text-primary"}`}
          >
            <ChevronRight
              className={`size-3.5 shrink-0 transition-transform duration-200 ${containsActiveProject ? "text-brand" : "text-secondary"} ${isOpen ? "rotate-90" : ""}`}
            />
            <Users
              className={`size-3.5 shrink-0 ${containsActiveProject ? "text-brand" : "text-secondary"}`}
            />
            <span
              className={`min-w-0 flex-1 truncate text-left ${containsActiveProject ? "font-medium text-primary" : "font-medium"}`}
            >
              {team.name}
            </span>

            {projects.length > 0 && (
              <span className="flex min-w-5 items-center justify-center rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] tabular-nums text-secondary">
                {projects.length}
              </span>
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="relative ml-[15px] mt-0.5 pl-[18px]">
            <div className="absolute bottom-2 left-0 top-1 w-px bg-border" />

            <div className="space-y-0.5">
              {projects?.length > 0 ? (
                projects.map((project: ProjectItem) => {
                  const active = project.id === activeProjectId;

                  return (
                    <Link
                      key={project.id}
                      href={`/${params?.workspaceId}/team/${team.id}/project/${project.id}`}
                      className={`group/project relative flex h-8 items-center gap-2 rounded-md px-2 mt-1 text-[13px] transition-colors duration-150  ${active ? "bg-accent font-medium text-primary" : "text-secondary hover:bg-accent hover:text-primary"}`}
                    >
                      <span className="absolute -left-[18px] top-1/2 h-px w-[10px] bg-border" />

                      <FolderKanban
                        className={`size-3.5 shrink-0 transition-colors ${active ? "text-brand" : "text-secondary group-hover/project:text-primary"}`}
                      />
                      <span className="truncate">{project.name}</span>
                    </Link>
                  );
                })
              ) : (
                <p className="px-2 py-1.5 text-xs text-secondary">
                  No projects yet
                </p>
              )}

              {isAdmin && (
                <Modal
                  open={isModalOpen}
                  setOpen={setIsModalOpen}
                  title="Create project"
                  body={
                    <CreateProjectModal
                      setIsModalOpen={setIsModalOpen}
                      teamId={team.id}
                    />
                  }
                  buttonVariant="ghost"
                  buttonSize="sm"
                  buttonClassName="mt-1 h-8 w-full justify-start gap-2 px-2 text-xs font-normal hover:bg-accent hover:text-primary "
                  buttonInnerText={<ProjectButton />}
                  subHeading="Organize work, track progress and collaborate."
                />
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default TeamItem;

const ProjectButton = () => {
  return (
    <>
      <Plus className="size-3.5" />
      <span>Add project</span>
    </>
  );
};
