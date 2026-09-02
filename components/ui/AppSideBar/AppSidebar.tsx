"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Plus, Settings2 } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Header from "./Header";
import { SidebarLoading } from "./SidebarLoading";
import { Modal } from "@/components/Common/Modal";
import { AddTeamForm } from "@/components/Forms/AddTeamForm";
import { nameInitials } from "@/utils/constants";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchTeamsDataAction } from "@/Store/actions/workspace.action";
import { logoutAction } from "@/Store/actions/auth.action";
import {
  AppSidebarProps,
  SidebarTeamsData,
  SidebarTeamType,
  SidebarWorkspaceData,
} from "@/types/types";
import TeamItem from "./TeamItem";

export function AppSidebar({ workspaceId }: AppSidebarProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  const {
    userData: { user },
    workspaceData: { workspaceData, teamsData, teamsWorkspaceId },
  } = useAppSelector((store: any) => store);

  const [loading, setLoading] = useState(false);
  const [teamModal, setTeamModal] = useState(false);

  const sidebarTeamsData = teamsData as SidebarTeamsData | null;
  const sidebarWorkspaceData = workspaceData as SidebarWorkspaceData | null;
  const teamsList =
    teamsWorkspaceId === workspaceId ? (sidebarTeamsData?.teamData ?? []) : [];
  const isAdmin = sidebarWorkspaceData?.adminList?.includes(workspaceId);
  const showSidebarLoading = !user || !workspaceData;

  useEffect(() => {
    if (teamsWorkspaceId === workspaceId) return;

    dispatch(fetchTeamsDataAction(workspaceId));
  }, [dispatch, teamsWorkspaceId, workspaceId]);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await dispatch(logoutAction());

      router.replace("/sign-in");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const isDashboardActive = pathname.includes("/dashboard");
  const isSettingsActive = pathname.includes("/settings");

  if (showSidebarLoading) {
    return <SidebarLoading />;
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-default bg-card">
      <SidebarHeader className="border-b border-default p-0">
        <Header workspaceData={workspaceData} />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup className="px-2 pt-3 pb-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  tooltip="Dashboard"
                  isActive={isDashboardActive}
                  onClick={() => router.push(`/${workspaceId}/dashboard`)}
                  className={`h-9 rounded-lg transition-colors duration-150 ${
                    isDashboardActive
                      ? "bg-accent text-primary"
                      : "text-secondary hover:bg-accent hover:text-primary"
                  }`}
                >
                  <LayoutDashboard
                    className={`size-4 ${
                      isDashboardActive ? "text-brand" : "text-secondary"
                    }`}
                  />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-2 pt-5">
          {!isCollapsed && (
            <div className="mb-1.5 flex h-7 items-center justify-between px-2">
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-secondary">
                Teams
              </span>

              {isAdmin && (
                <Modal
                  open={teamModal}
                  setOpen={setTeamModal}
                  title="Create team"
                  body={<AddTeamForm setModal={setTeamModal} />}
                  buttonVariant="ghost"
                  buttonSize="icon"
                  buttonClassName="size-7 hover:bg-accent hover:text-primary "
                  buttonInnerText={<Plus className="size-3.5" />}
                  subHeading={
                    "Teams help organize people and projects within your workspace."
                  }
                />
              )}
            </div>
          )}

          {isCollapsed && isAdmin && (
            <div className="mb-2 flex justify-center">
              <Modal
                open={teamModal}
                setOpen={() => setTeamModal((prev) => !prev)}
                title="Add New Team"
                body={<AddTeamForm setModal={setTeamModal} />}
                buttonClassName="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-primary "
                buttonInnerText={<Plus className="size-4" />}
                buttonSize="icon"
                buttonVariant="ghost"
              />
            </div>
          )}

          <SidebarGroupContent>
            <div className="space-y-1">
              {teamsList.length > 0 ? (
                teamsList.map((team: SidebarTeamType) => (
                  <TeamItem
                    key={team.id}
                    team={team}
                    params={params}
                    isAdmin={isAdmin}
                  />
                ))
              ) : !isCollapsed ? (
                <div className="px-2 py-3">
                  <p className="text-xs text-secondary">
                    No teams created yet.
                  </p>
                </div>
              ) : null}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        {isAdmin && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                tooltip="Workspace settings"
                isActive={isSettingsActive}
                onClick={() => router.push(`/${workspaceId}/settings`)}
                className={`h-9 rounded-lg transition-colors duration-150  ${isSettingsActive ? "bg-accent text-primary" : "text-secondary hover:bg-accent hover:text-primary"}`}
              >
                <Settings2
                  className={`size-4 ${isSettingsActive ? "text-brand" : "text-secondary"}`}
                />
                <span>Workspace settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        <div
          className={`
            mt-1 flex items-center rounded-lg
            ${isCollapsed ? "justify-center p-1" : "gap-3 px-2 py-2"}
          `}
        >
          <Avatar className="size-8 shrink-0 overflow-hidden rounded-full border border-border bg-accent">
            <AvatarImage src={user?.image} className="size-full object-cover" />

            <AvatarFallback className="flex size-full items-center justify-center text-xs font-medium text-primary">
              {nameInitials(user)}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium text-primary"
                  title={user?.name || user?.email}
                >
                  {user?.name || user?.email}
                </p>

                {user?.name && (
                  <p
                    className="truncate text-xs text-secondary"
                    title={user?.email}
                  >
                    {user?.email}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                title="Log out"
                aria-label="Log out"
                className="focus-ring flex size-8 shrink-0 items-center justify-center rounded-md text-secondary transition-colors hover:bg-accent hover:text-primary disabled:pointer-events-none disabled:opacity-50"
              >
                <LogOut className="size-4" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
