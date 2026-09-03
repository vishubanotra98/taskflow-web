"use client";

import { ArrowRight, ArrowUpRight, CirclePlus } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { icons } from "@/utils/constants";
import { ErrorToast } from "../../Toast/ErrorToast";

dayjs.extend(relativeTime);

function StatusValue({ status }: { status: any }) {
  const value = status?.name ?? status ?? "None";

  return (
    <span className="rounded-md border border-default bg-secondary/[0.035] px-1.5 py-0.5">
      {value}
    </span>
  );
}

function ChangeValue({ before, after, isStatus = false }: any) {
  const beforeValue = before?.name ?? before ?? "None";
  const afterValue = after?.name ?? after ?? "None";

  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
      {isStatus ? (
        <StatusValue status={before} />
      ) : (
        <span className="max-w-[160px] truncate text-secondary/75">
          {beforeValue}
        </span>
      )}

      <ArrowRight
        size={11}
        strokeWidth={1.75}
        className="shrink-0 text-secondary/35"
      />

      {isStatus ? (
        <StatusValue status={after} />
      ) : (
        <span className="max-w-[160px] truncate text-secondary/75">
          {afterValue}
        </span>
      )}
    </span>
  );
}

function formatDate(date?: string | Date | null) {
  if (!date) return "None";

  return dayjs(date).format("MMM D, YYYY");
}

function getDetailsUpdatedContent(activity: any) {
  const before = activity.beforeState ?? {};
  const after = activity.afterState ?? {};

  if (before.title !== after.title) {
    return {
      verb: "updated title",
      subtitle: <ChangeValue before={before.title} after={after.title} />,
    };
  }

  if (before.description !== after.description) {
    return {
      verb: "updated description",
      subtitle: "Description changed",
    };
  }

  if (before.blockedReason !== after.blockedReason) {
    return {
      verb: "updated blocked reason",
      subtitle: (
        <ChangeValue
          before={before.blockedReason ?? "None"}
          after={after.blockedReason ?? "None"}
        />
      ),
    };
  }

  return {
    verb: "updated",
    subtitle: null,
  };
}

function getActivityContent(activity: any) {
  switch (activity.action) {
    case "STATUS_CHANGED":
      return {
        verb: "moved",
        subtitle: (
          <ChangeValue
            before={activity.beforeState?.status}
            after={activity.afterState?.status}
            isStatus
          />
        ),
      };

    case "CREATED":
      return {
        verb: "created",
        subtitle: null,
      };

    case "DELETED":
      return {
        verb: "deleted",
        subtitle: null,
      };

    case "COMPLETED":
      return {
        verb: "completed",
        subtitle: null,
      };

    case "ASSIGNED":
      return {
        verb: "assigned",
        subtitle: (
          <ChangeValue
            before={activity.beforeState?.assignee?.name ?? "Unassigned"}
            after={activity.afterState?.assignee?.name ?? "Unassigned"}
          />
        ),
      };

    case "UNASSIGNED":
      return {
        verb: "unassigned",
        subtitle: (
          <ChangeValue
            before={activity.beforeState?.assignee?.name ?? "Assigned"}
            after="Unassigned"
          />
        ),
      };

    case "PRIORITY_CHANGED":
      return {
        verb: "updated priority",
        subtitle: (
          <ChangeValue
            before={activity.beforeState?.priority ?? "None"}
            after={activity.afterState?.priority ?? "None"}
          />
        ),
      };

    case "TARGET_DATE_CHANGED":
      return {
        verb: "updated target date",
        subtitle: (
          <ChangeValue
            before={formatDate(activity.beforeState?.targetDate)}
            after={formatDate(activity.afterState?.targetDate)}
          />
        ),
      };

    case "DETAILS_UPDATED":
      return getDetailsUpdatedContent(activity);

    default:
      return {
        verb: "updated",
        subtitle: null,
      };
  }
}

function getIssueUrl(activity: any) {
  return (
    `/${activity.workspaceId}` +
    `/team/${activity.team?.id}` +
    `/project/${activity.project?.id}` +
    `/issue/${activity.issue?.id}?dashboard=true`
  );
}

export default function ActivityItem({
  activity,
  isLast,
}: {
  activity: any;
  isLast: boolean;
}) {
  const router = useRouter();
  const isDeleted = activity.action === "DELETED";
  const Icon = icons[activity.action as keyof typeof icons] ?? CirclePlus;
  const { verb, subtitle } = getActivityContent(activity);

  const statusColor =
    activity.action === "STATUS_CHANGED"
      ? activity.afterState?.status?.color
      : undefined;

  const handleClick = () => {
    if (isDeleted) {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Issue deleted"
          description="This issue is no longer available."
        />
      ));

      return;
    }

    router.push(getIssueUrl(activity));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handleClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        group flex min-h-[68px] w-full items-center gap-3.5
        px-4 text-left
        transition-colors duration-150
        ${
          !isDeleted
            ? "cursor-pointer hover:bg-secondary/[0.06]"
            : "cursor-default"
        }
        ${!isLast ? "border-b border-default/70" : ""}
      `}
    >
      <div
        className={` flex size-8 shrink-0 items-center justify-center rounded-lg border border-default/80 bg-secondary/[0.025] transition-colors duration-150 ${!isDeleted ? "group-hover:border-secondary/20 group-hover:bg-secondary/[0.06]" : ""}`}
      >
        <Icon
          size={13}
          strokeWidth={1.8}
          className={
            isDeleted
              ? "text-secondary/35"
              : statusColor
                ? ""
                : "text-secondary/75"
          }
          style={!isDeleted && statusColor ? { color: statusColor } : undefined}
        />
      </div>

      <div
        className={`
          min-w-0 flex-1
          ${isDeleted ? "opacity-55" : ""}
        `}
      >
        <p className="flex min-w-0 items-center gap-1.5 text-[13px] leading-5">
          <span className="shrink-0 font-medium text-primary">
            {activity.actor?.name}
          </span>

          <span className="shrink-0 text-secondary/70">{verb}</span>

          <span
            className={`min-w-0 truncate font-medium text-primary transition-colors duration-150
              ${!isDeleted ? "group-hover:text-brand" : ""}
            `}
          >
            {activity.issue?.title}
          </span>
        </p>

        {subtitle && (
          <p className="mt-1 truncate text-[11px] leading-4 text-secondary/65">
            {subtitle}
          </p>
        )}
      </div>

      <div>
        <time
          className="shrink-0 self-start pt-[3px] text-[11px] tabular-nums text-secondary/50 transition-colors duration-150 group-hover:text-secondary/65"
          title={dayjs(activity.created_at).format("MMM D, YYYY h:mm A")}
        >
          {dayjs(activity.created_at).fromNow()}
        </time>
        <div className="flex shrink-0 items-center gap-1 font-medium opacity-0 transition-normal group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-brand text-[11px] ">
          <span>Open</span>

          <ArrowUpRight size={14} />
        </div>
      </div>
    </div>
  );
}
