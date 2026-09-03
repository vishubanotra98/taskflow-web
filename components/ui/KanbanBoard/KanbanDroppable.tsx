"use client";

import Icon from "./StatusIcon";

import { useDroppable } from "@dnd-kit/react";

import { IssueForm } from "@/components/Forms/IssueForm";

import { useState } from "react";

import { Modal } from "@/components/Common/Modal";

import { Plus } from "lucide-react";

interface KanbanDroppableInterface {
  id: string;
  children: (isDropTarget: boolean) => React.ReactNode;
  status: any;
  workspaceMembers: any;
  statusList: any;
  projectId: string;
  setIssues: any;
}

const KanbanDroppable = ({
  id,
  children,
  status,
  workspaceMembers,
  statusList,
  projectId,
  setIssues,
}: KanbanDroppableInterface) => {
  const [open, setOpen] = useState(false);

  const { ref, isDropTarget } = useDroppable({
    id,
  });

  const issueCount = status?._count?.issues;

  const issueFormPropObj = {
    open,
    setOpen,
    selectedStatus: status,
    workspaceMembers,
    statusList,
    setIssues,
  };

  return (
    <div ref={ref} className="flex h-full w-[360px] shrink-0 flex-col">
      <header className="mb-3 flex items-center justify-between px-2">
        <Icon status={status?.name} />

        <div className="flex items-center gap-2">
          <span className="flex h-6 min-w-6 items-center justify-center rounded-md border border-default bg-card px-2 text-[11px] font-semibold text-secondary">
            {issueCount}
          </span>
        </div>
      </header>

      <div
        className={`
          flex-1 overflow-y-auto rounded-xl
          border border-default/60
          bg-secondary/15
          p-3
          transition-colors duration-200
          ${isDropTarget ? "bg-secondary/20" : ""}
        `}
      >
        <Modal
          open={open}
          setOpen={setOpen}
          title="Create Issue"
          buttonVariant="secondary"
          buttonSize="icon"
          modalWidth="1080px"
          buttonClassName="w-full flex items-center justify-center gap-1 mb-2"
          buttonInnerText={
            <>
              <Plus
                size={15}
                strokeWidth={2.2}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
              Create Issue
            </>
          }
          subHeading="Provide the issue details to help your team track and resolve it."
          body={<IssueForm issueFormProp={issueFormPropObj} />}
        />

        <div className="space-y-1">{children(isDropTarget)}</div>
      </div>
    </div>
  );
};

export default KanbanDroppable;
