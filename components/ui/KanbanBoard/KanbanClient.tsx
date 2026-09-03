"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { useRouter } from "next/navigation";
import KanbanDroppable from "@/components/ui/KanbanBoard/KanbanDroppable";
import DraggableCard from "@/components/ui/KanbanBoard/DraggableCard";
import { useState } from "react";

const KanbanClient = ({ data, handleDragOver }: any) => {
  const router = useRouter();

  const {
    projectId,
    workspaceMembers,
    workspaceStatus,
    setIssues,
    issues,
    team,
    workspaceId,
    teamId,
  } = data;

  const issuesByStatus = issues.reduce((acc: any, issue: any) => {
    if (!acc[issue.statusId]) {
      acc[issue.statusId] = [];
    }

    acc[issue.statusId].push(issue);

    return acc;
  }, {});

  return (
    <DragDropProvider onDragEnd={handleDragOver}>
      <section className="h-full overflow-hidden">
        <div className="h-full">
          <div className="kanban-scroll flex h-full items-start gap-6 overflow-x-auto overflow-y-hidden pb-4">
            {workspaceStatus?.map((status: any) => (
              <KanbanDroppable
                key={status.id}
                id={status.id}
                projectId={projectId}
                status={status}
                statusList={workspaceStatus}
                workspaceMembers={workspaceMembers}
                setIssues={setIssues}
              >
                {(isDropTarget) =>
                  !issuesByStatus[status.id] ? (
                    <div className="mt-5 flex h-[134.5px] min-h-[72px] w-full items-center justify-center rounded-xl border-2 border-dashed border-default bg-card px-4 transition-colors">
                      <span className="text-[12px] font-medium text-secondary/55">
                        {isDropTarget
                          ? "Release to move issue"
                          : "No issues yet"}
                      </span>
                    </div>
                  ) : (
                    (issuesByStatus[status.id] ?? []).map((issue: any) => {
                      const member = workspaceMembers?.find(
                        (mem: any) => mem.user?.id === issue.assigneeId,
                      );

                      const user = member?.user;

                      const userName =
                        user?.name ??
                        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

                      return (
                        <div
                          key={issue.id}
                          className="w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                          onClick={() =>
                            router.push(
                              `/${workspaceId}/team/${teamId}/project/${projectId}/issue/${issue.id}`,
                            )
                          }
                        >
                          <DraggableCard
                            issueData={{
                              issue,
                              name: userName,
                              team,
                            }}
                          />
                        </div>
                      );
                    })
                  )
                }
              </KanbanDroppable>
            ))}
          </div>
        </div>
      </section>
    </DragDropProvider>
  );
};

export default KanbanClient;
