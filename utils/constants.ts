import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Loader,
  XCircle,
  PlusCircle,
  Trash2,
  ArrowRightLeft,
  Flag,
  UserPlus,
  Pencil,
  CircleSlash,
  Eye,
  UserMinus,
  CirclePlus,
  CircleCheckBig,
  CalendarDays,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    label: "Issues",
    to: "/issues",
  },
];

export const DEFAULT_STATUSES = [
  {
    name: "Todo",
    color: "#6b7280",
    order: 1,
    isInitial: true,
    isDefault: false,
    isInProgress: false,
    isBlocked: false,
    isCompleted: false,
    isCancelled: false,
    isInReview: false,
    icon: Circle,
  },
  {
    name: "In Progress",
    color: "#2563eb",
    order: 2,
    isInitial: false,
    isInProgress: true,
    isDefault: false,
    isBlocked: false,
    isCompleted: false,
    isCancelled: false,
    isInReview: false,
    icon: Loader,
  },
  {
    name: "In Review",
    color: "#8b5cf6",
    order: 3,
    isInitial: false,
    isInProgress: false,
    isBlocked: false,
    isCompleted: false,
    isCancelled: false,
    isInReview: true,
    icon: Eye,
  },
  {
    name: "Done",
    color: "#16a34a",
    order: 4,
    isInProgress: false,
    isBlocked: false,
    isCompleted: true,
    isDefault: false,
    isInitial: false,
    isCancelled: false,
    isInReview: false,
    icon: CheckCircle2,
  },
  {
    name: "Cancelled",
    color: "#ef4444",
    order: 5,
    isBlocked: false,
    isCompleted: false,
    isDefault: false,
    isInitial: false,
    isInProgress: false,
    isCancelled: true,
    isInReview: false,
    icon: XCircle,
  },
  {
    name: "Blocked",
    color: "#f59e0b",
    order: 6,
    isBlocked: true,
    isCompleted: false,
    isDefault: false,
    isInitial: false,
    isInProgress: false,
    isCancelled: false,
    isInReview: false,
    icon: CircleSlash,
  },
];

export const priorityList = [
  { value: "LOW", label: "Low", icon: ArrowDown, color: "#3b82f6" },
  { value: "MEDIUM", label: "Medium", icon: ArrowRight, color: "#f59e0b" },
  { value: "HIGH", label: "High", icon: ArrowUp, color: "#ef4444" },
  { value: "URGENT", label: "Urgent", icon: AlertCircle, color: "#dc2626" },
];

export const activityConfig: any = {
  CREATED: {
    icon: PlusCircle,
    label: "created",
    color: "text-emerald-400",
  },
  DELETED: {
    icon: Trash2,
    label: "deleted",
    color: "text-red-400",
  },
  STATUS_CHANGED: {
    icon: ArrowRightLeft,
    label: "changed the status of",
    color: "text-blue-400",
  },
  PRIORITY_CHANGED: {
    icon: Flag,
    label: "updated the priority of",
    color: "text-orange-400",
  },
  ASSIGNED: {
    icon: UserPlus,
    label: "assigned",
    color: "text-indigo-400",
  },
  DETAILS_UPDATED: {
    icon: Pencil,
    label: "updated the details of",
    color: "text-gray-400",
  },
};

export const nameInitials = (user: any) => {
  return user?.name
    ? user?.name
        ?.split(" ")
        .map((item: any) => item[0])
        .join("")
    : user?.firstName[0] + user?.lastName[0];
};

export const badgeVariants: Record<string, string> = {
  BLOCKED: "text-red-400",
  TARGET_REACHED: "text-amber-400",
  URGENT: "text-orange-400",
  UNASSIGNED: "text-sky-400",
  NO_UPDATES: "text-secondary",

  OVERDUE: "text-red-500",
  DUE_DAY: "text-yellow-400",
  STALE: "text-zinc-400",
  HIGH: "text-orange-500",
};

export const badgeLabels: Record<string, string> = {
  BLOCKED: "Blocked",
  TARGET_REACHED: "Target Reached",
  URGENT: "Urgent",
  UNASSIGNED: "Unassigned",
  NO_UPDATES: "No Updates",
  OVERDUE: "Overdue",
  STALE: "Stale",
};

export const icons = {
  STATUS_CHANGED: ArrowRight,
  ASSIGNED: UserPlus,
  UNASSIGNED: UserMinus,
  PRIORITY_CHANGED: Flag,
  CREATED: CirclePlus,
  COMPLETED: CircleCheckBig,
  DETAILS_UPDATED: Pencil,
  TARGET_DATE_CHANGED: CalendarDays,
  DELETED: Trash2,
};

export const colors = {
  STATUS_CHANGED: "text-brand",
  ASSIGNED: "text-brand",
  UNASSIGNED: "text-secondary",
  PRIORITY_CHANGED: "text-orange-500",
  CREATED: "text-brand",
  COMPLETED: "text-green-500",
  DETAILS_UPDATED: "text-brand",
  TARGET_DATE_CHANGED: "text-brand",
  DELETED: "text-red-500",
};
