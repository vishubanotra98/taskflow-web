"use client";

import { useDraggable } from "@dnd-kit/react";

import { priorityList } from "@/utils/constants";

const DraggableCard = ({ issueData }: any) => {
  const { issue } = issueData;
  const { ref } = useDraggable({
    id: issue?.id,
  });

  const nameInitials = issueData?.name
    ?.split(" ")
    ?.map((name: string) => name[0])
    .join("");

  const team = issueData?.team;
  const currentPriority = priorityList?.find(
    (p) => p.value === issue?.priority?.toUpperCase(),
  );

  const PriorityIcon = currentPriority?.icon;

  return (
    <div ref={ref} className="pt-2.5">
      <div className=" group w-full cursor-grab rounded-xl border border-default bg-card p-4 transition-fast active:cursor-grabbing card-hover active-card-hover">
        <div className="mb-3 flex items-start justify-between">
          <span className="font-mono text-[11px] text-secondary">
            {issue?.ticket_num}
          </span>

          <div className="flex -space-x-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand">
              <span className="text-[9px] font-semibold text-inverse">
                {nameInitials}
              </span>
            </div>
          </div>
        </div>

        <h4 className="text-sm font-medium leading-6 text-primary transition-fast">
          {issue?.title}
        </h4>

        <div className="mt-4 flex items-center gap-2">
          {PriorityIcon && (
            <div
              className="flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1"
              title={`Priority: ${currentPriority?.label}`}
            >
              <PriorityIcon size={12} color={currentPriority?.color} />
              <span className="text-[11px] font-medium text-secondary">
                {currentPriority?.label}
              </span>
            </div>
          )}

          <span className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-secondary">
            {team?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DraggableCard;
