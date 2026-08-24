"use client";

import {
  fetchDeletedProjectsAction,
  fetchDeletedTeamsAction,
  fetchProjectsAction,
  fetchWorkspaceMambersAction,
} from "@/Store/actions/workspace.action";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import MembersTabContent from "./MemberSettings";
import TeamsProjectsTabContent from "./TeamsProjectsTabContent";
import DangerContentTab from "./DangerContentTab";
import SubtendLoader from "@/components/Loader/SubtendLoader";
import TrashContentTab from "./TrashContent";
import { IntegrationTab } from "./IntegrationsTab";

type OptionTypes =
  "general" | "members" | "teamproject" | "trash" | "danger" | "integration";

const options: { label: string; value: OptionTypes }[] = [
  // { label: "General", value: "general" },
  { label: "Members", value: "members" },
  { label: "Teams & Projects", value: "teamproject" },
  { label: "Trash", value: "trash" },
  { label: "Integration", value: "integration" },
  // { label: "Danger Zone", value: "danger" },
];

const WorkspaceSettings = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const searchParams = useSearchParams();
  const github = Boolean(searchParams.get("github"));

  const {
    userData: { user },
    workspaceData: { workspaceMembers, teamsData, teamsWorkspaceId },
  } = useAppSelector((store: any) => store);

  const [option, setOption] = useState<OptionTypes>(
    github ? "integration" : "members",
  );
  const [projects, setProjects] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deletedProjects, setDeletedProjects] = useState<any | null>(null);
  const [deletedTeams, setDeletedTeams] = useState<any | null>(null);

  const fetchData = async () => {
    const res = await dispatch(fetchProjectsAction(workspaceId))?.unwrap();
    const projectList = res?.data?.projects ?? [];
    setProjects(projectList);

    const deletedProjectListRes = await dispatch(
      fetchDeletedProjectsAction(workspaceId),
    ).unwrap();
    const deletedProjectList = deletedProjectListRes?.data?.projects;
    setDeletedProjects(deletedProjectList ?? []);

    const deletedTeamListRes = await dispatch(
      fetchDeletedTeamsAction(workspaceId),
    ).unwrap();
    const deletedTeamList = deletedTeamListRes?.data?.teams;
    setDeletedTeams(deletedTeamList ?? []);
  };

  useEffect(() => {
    if (!workspaceId) return;

    const init = async () => {
      await fetchData();
      try {
        setLoading(true);
        await dispatch(fetchWorkspaceMambersAction(workspaceId));
      } catch (err: any) {
        if (err?.code === "NO_PROJECTS_FOUND") setProjects([]);
        if (err?.code === "DELETED_PROJECT_NOT_FOUND") setDeletedProjects([]);
        if (err?.code === "DELETED_TEAMS_NOT_FOUND") setDeletedTeams([]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [dispatch, workspaceId]);

  if (loading) {
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <SubtendLoader />
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] min-h-full w-full overflow-hidden bg-background">
      <aside className="flex h-full min-h-full w-56 shrink-0 flex-col border-r border-default bg-secondary/5">
        <div className="px-3 py-6">
          <div className="mb-6 px-3">
            <h2 className="text-sm font-semibold text-primary">
              Workspace settings
            </h2>

            <p className="mt-1 text-xs text-secondary">Manage your workspace</p>
          </div>

          <nav className=" space-y-1">
            {options.map((tab) => {
              const isActive = option === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setOption(tab.value)}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-150 cursor-pointer ${isActive ? "bg-brand/20 text-primary" : "text-secondary hover:bg-brand/60 hover:text-primary"}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="w-full px-10 py-8">
          <div className="w-full">
            {option === "general" && (
              <div className="text-sm text-secondary">
                General Settings Content
              </div>
            )}

            {option === "members" && (
              <MembersTabContent
                workspaceMembers={workspaceMembers}
                currentUser={user?.id}
              />
            )}

            {option === "teamproject" && (
              <TeamsProjectsTabContent
                projects={projects}
                setProjects={setProjects}
                teams={teamsData}
                fetchData={fetchData}
              />
            )}

            {option === "trash" && (
              <TrashContentTab
                deletedProjects={deletedProjects}
                deletedTeams={deletedTeams}
                projectList={projects}
                fetchData={fetchData}
              />
            )}
            {option === "danger" && <DangerContentTab />}
            {option === "integration" && <IntegrationTab />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspaceSettings;
