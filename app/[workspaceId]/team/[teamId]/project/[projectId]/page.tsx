"use client";

import { IssueFilters } from "@/components/Forms/IssueFilters";
import SubtendLoader from "@/components/Loader/SubtendLoader";
import { Button } from "@/components/ui/button";
import KanbanClient from "@/components/ui/KanbanBoard/KanbanClient";
import { SearchInput } from "@/components/ui/searchBar";
import {
  fetchIssuesByProjectAction,
  fetchProjectByIdAction,
  fetchWorkspaceMambersAction,
  fetchWorkspaceStatusAction,
  moveCardAction,
} from "@/Store/actions/workspace.action";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { priorityList } from "@/utils/constants";
import { Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type IssueFiltersState = {
  startDate: Date | null;
  endDate: Date | null;
  assignee: string | null;
  status: string | null;
  priority: string | null;
};

export default function ProjectIssue() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    workspaceData: { workspaceMembers, workspaceStatus, teamsData },
  } = useAppSelector((store: any) => store);

  const params = useParams<{
    workspaceId: string;
    teamId: string;
    projectId: string;
  }>();

  const workspaceId = params.workspaceId;
  const teamId = params.teamId;
  const projectId = params.projectId;

  const [issues, setIssues] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);

  const [load, setLoad] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<IssueFiltersState>({
    startDate: null,
    endDate: null,
    assignee: null,
    status: null,
    priority: null,
  });

  const buildIssueParams = useCallback(() => {
    const queryParams: Record<string, string> = {};

    const searchValue = search.trim();

    if (searchValue) {
      queryParams.search = searchValue;
    }

    if (filters.startDate) {
      queryParams.startDate = filters.startDate.toISOString();
    }

    if (filters.endDate) {
      queryParams.endDate = filters.endDate.toISOString();
    }

    if (filters.assignee) {
      queryParams.assignee = filters.assignee;
    }

    if (filters.status) {
      queryParams.status = filters.status;
    }

    if (filters.priority) {
      queryParams.priority = filters.priority;
    }

    return queryParams;
  }, [
    search,
    filters.startDate,
    filters.endDate,
    filters.assignee,
    filters.status,
    filters.priority,
  ]);

  const fetchIssues = useCallback(async () => {
    if (!projectId) return;

    try {
      setIssuesLoading(true);
      const queryParams = buildIssueParams();

      const issuesRes = await dispatch(
        fetchIssuesByProjectAction({
          projectId,
          params: queryParams,
        }),
      ).unwrap();

      setIssues(issuesRes?.data?.issues ?? []);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      setIssues([]);
    } finally {
      setIssuesLoading(false);
    }
  }, [dispatch, projectId, buildIssueParams]);

  useEffect(() => {
    if (!projectId || !workspaceId) return;

    let isMounted = true;
    const init = async () => {
      try {
        setLoad(true);
        const [, , projectRes] = await Promise.all([
          dispatch(fetchWorkspaceMambersAction(workspaceId)).unwrap(),
          dispatch(
            fetchWorkspaceStatusAction({
              workspaceId,
              projectId,
            }),
          ),
          dispatch(fetchProjectByIdAction(projectId)),
        ]);

        if (!isMounted) return;

        const projectData = projectRes?.payload?.data?.project;
        setProject(projectData ?? null);
      } catch (error) {
        console.error("Failed to initialize project:", error);
      } finally {
        if (isMounted) {
          setLoad(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [dispatch, projectId, workspaceId]);

  useEffect(() => {
    if (!projectId) return;

    const timer = setTimeout(() => {
      fetchIssues();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [projectId, fetchIssues]);

  const handleApplyFilters = useCallback((newFilters: IssueFiltersState) => {
    setFilters(newFilters);
  }, []);

  const team = teamsData?.teamData?.find((team: any) => team?.id === teamId);

  const handleDragOver = async (event: any) => {
    const sourceId = event.operation.source?.id as string;
    const targetId = event.operation.target?.id as string;

    if (!targetId || sourceId === targetId) return;

    setIssues((prevIssues) =>
      prevIssues.map((issue: any) => {
        if (issue.id === sourceId) {
          return {
            ...issue,
            statusId: targetId,
          };
        }

        return issue;
      }),
    );

    try {
      await dispatch(
        moveCardAction({
          sourceId,
          targetId,
          workspaceId,
          teamId,
        }),
      ).unwrap();

      await fetchIssues();

      await dispatch(
        fetchWorkspaceStatusAction({
          workspaceId,
          projectId,
        }),
      );
    } catch (error) {
      console.error("Failed to move issue:", error);

      await fetchIssues();
    }
  };

  const data = {
    projectId,
    workspaceMembers,
    workspaceStatus,
    setIssues,
    issues,
    team,
    workspaceId,
    teamId,
  };

  if (load) {
    return (
      <div className="flex h-[84vh] w-full items-center justify-center">
        <SubtendLoader />
      </div>
    );
  }

  return (
    <main className="flex h-full flex-col bg-background">
      <header className="border-b border-default">
        <div className="mx-auto flex w-full flex-col gap-6 px-8 pb-2 pt-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-primary">
              {project?.name}
            </h1>

            {project?.projectOverview && (
              <p className="max-w-3xl text-sm leading-6 text-secondary">
                {project.projectOverview}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <SearchInput
                className="w-[350px]"
                placeholder="Search issue by number or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <IssueFilters
                members={workspaceMembers}
                statusList={workspaceStatus}
                priorityList={priorityList}
                filters={filters}
                issuesLoading={issuesLoading}
                onApply={handleApplyFilters}
              />

              <Button
                variant="soft"
                iconAnimation="spin-ccw"
                onClick={() =>
                  router.push(
                    `/${workspaceId}/team/${teamId}/project/${projectId}/project-settings`,
                  )
                }
              >
                <Settings size={14} strokeWidth={1.8} />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-hidden">
        <div className="relative h-full px-8 py-6">
          <KanbanClient data={data} handleDragOver={handleDragOver} />
        </div>

        {issuesLoading && (
          <div className="absolute pointer-events-none top-20 right-10">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-default border-t-brand" />
          </div>
        )}
      </section>
    </main>
  );
}
