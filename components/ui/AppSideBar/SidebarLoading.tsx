import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function SidebarLoading() {
  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarHeader className="border-b border-border p-0">
        <div className="flex h-16 items-center justify-between px-3">
          <Skeleton className="size-9 rounded-lg" />

          <Skeleton className="size-8 rounded-lg" />
        </div>

        <div className="px-2 pb-3">
          <div className="flex min-h-10 items-center gap-2.5 px-2 py-1.5">
            <Skeleton className="size-7 shrink-0 rounded-md" />

            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-2.5 w-14 rounded" />
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup className="px-2 pt-3 pb-0">
          <div className="flex h-9 items-center gap-2 px-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-3.5 w-20 rounded" />
          </div>
        </SidebarGroup>

        <SidebarGroup className="px-2 pt-5">
          <div className="mb-1.5 flex h-7 items-center justify-between px-2">
            <Skeleton className="h-2.5 w-10 rounded" />
            <Skeleton className="size-7 rounded-md" />
          </div>

          <div className="space-y-3">
            <TeamSkeleton teamWidth="w-20" projectWidths={["w-24", "w-16"]} />

            <TeamSkeleton teamWidth="w-16" projectWidths={["w-20"]} />
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <div className="flex h-9 items-center gap-2 px-2">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-3.5 w-28 rounded" />
        </div>

        <div className="mt-1 flex items-center gap-3 px-2 py-2">
          <Skeleton className="size-8 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-2.5 w-32 rounded" />
          </div>

          <Skeleton className="size-4 shrink-0 rounded-sm" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

type TeamSkeletonProps = {
  teamWidth: string;
  projectWidths: string[];
};

function TeamSkeleton({ teamWidth, projectWidths }: TeamSkeletonProps) {
  return (
    <div>
      <div className="flex h-9 items-center gap-2 px-2">
        <Skeleton className="size-3.5 shrink-0 rounded-sm" />

        <Skeleton className="size-3.5 shrink-0 rounded-sm" />

        <Skeleton className={`h-3.5 rounded ${teamWidth}`} />

        <Skeleton className="ml-auto h-3 w-4 rounded" />
      </div>

      <div className="relative ml-[15px] mt-0.5 pl-[18px]">
        <div className="absolute bottom-2 left-0 top-1 w-px bg-border" />

        <div className="space-y-0.5">
          {projectWidths.map((width, index) => (
            <div
              key={index}
              className="relative flex h-8 items-center gap-2 px-2"
            >
              <span className="absolute -left-[18px] top-1/2 h-px w-[10px] bg-border" />

              <Skeleton className="size-3.5 shrink-0 rounded-sm" />

              <Skeleton className={`h-3 rounded ${width}`} />
            </div>
          ))}

          <div className="mt-1 flex h-8 items-center gap-2 px-2">
            <Skeleton className="size-3.5 shrink-0 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
