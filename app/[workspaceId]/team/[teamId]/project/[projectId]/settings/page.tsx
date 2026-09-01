"use client";

import { ErrorToast } from "@/components/ui/Toast/ErrorToast";
import {
  fetchGithubReposAction,
  fetchProjectReposAction,
  selectRepoAction,
} from "@/Store/actions/workspace.action";
import { useAppDispatch } from "@/Store/hooks";
import { Github, GitBranch, ExternalLink, Settings2, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProjectSettingsPage() {
  const dispatch = useAppDispatch();

  const params = useParams<{
    workspaceId: string;
    teamId: string;
    projectId: string;
  }>();

  const workspaceId = params.workspaceId;
  const projectId = params.projectId;

  const [showRepositories, setShowRepositories] = useState(false);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [projectRepos, setProjectRepos] = useState<any[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [projectReposLoading, setProjectReposLoading] = useState(true);
  const [selectingRepoId, setSelectingRepoId] = useState<number | null>(null);

  const githubConnected = true;

  const fetchProjectRepositories = async () => {
    if (!workspaceId || !projectId) return;
    try {
      setProjectReposLoading(true);
      const response = await dispatch(
        fetchProjectReposAction(projectId),
      ).unwrap();

      setProjectRepos(response?.data?.repositories ?? []);
    } catch (error: any) {
      console.error("Failed to fetch project repositories:", error);

      setProjectRepos([]);

      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Failed to load repositories"
          description={
            error?.message ||
            "Unable to fetch the repositories connected to this project."
          }
        />
      ));
    } finally {
      setProjectReposLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectRepositories();
  }, [workspaceId, projectId]);

  const handleGithubMenuOpen = async () => {
    if (!workspaceId) return;
    setShowRepositories(true);

    if (githubRepos.length > 0) {
      return;
    }

    try {
      setGithubLoading(true);
      const response = await dispatch(
        fetchGithubReposAction(workspaceId),
      ).unwrap();
      const repositories = response?.data?.repositories ?? [];

      setGithubRepos(repositories);
    } catch (error: any) {
      console.error("Failed to fetch GitHub repositories:", error);
      setGithubRepos([]);
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Failed to load GitHub repositories"
          description={
            error?.message ||
            "Unable to fetch repositories from your GitHub account."
          }
        />
      ));
    } finally {
      setGithubLoading(false);
    }
  };

  const handleRepositorySelect = async (repo: any) => {
    if (!workspaceId || !projectId || !repo?.id) {
      return;
    }

    const alreadyConnected = projectRepos?.some(
      (projectRepo) => projectRepo?.repoId === repo?.id,
    );

    if (alreadyConnected) {
      setShowRepositories(false);
      return;
    }

    try {
      setSelectingRepoId(repo.id);
      const response = await dispatch(
        selectRepoAction({
          workspaceId,
          projectId,
          repoId: repo?.id,
          repoFullName: repo?.fullName,
          repoName: repo?.name,
          ownerName: repo?.user_name,
        }),
      ).unwrap();

      const createdRepo = response?.data?.repository;

      if (createdRepo) {
        setProjectRepos((prev) => {
          const exists = prev.some(
            (projectRepo) => projectRepo?.repoId === createdRepo?.repoId,
          );

          if (exists) {
            return prev;
          }

          return [...prev, createdRepo];
        });
      } else {
        await fetchProjectRepositories();
      }

      setShowRepositories(false);
    } catch (error: any) {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Failed to connect repository"
          description={
            error?.message ||
            "Unable to connect this repository to the project."
          }
        />
      ));
    } finally {
      setSelectingRepoId(null);
    }
  };

  const repository = projectRepos?.[0] ?? null;

  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
              <Settings2 size={16} className="text-brand" />
            </div>

            <h1 className="text-base font-semibold text-primary">
              Project settings
            </h1>
          </div>

          <p className="mt-1.5 text-sm text-secondary">
            Manage project configuration and connected services.
          </p>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-primary">
              GitHub repository
            </h2>

            <p className="mt-1 text-sm text-secondary">
              Connect this project to a repository to link your development work
              with issues.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-default bg-card">
            <div className="flex items-center justify-between gap-6 px-5 py-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Github size={18} className="text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary">Repository</p>

                  {repository ? (
                    <div className="mt-1 flex items-center gap-2">
                      <GitBranch size={13} className="text-secondary" />

                      <span className="truncate text-xs text-secondary">
                        {repository.repoFullName}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-secondary">
                      No repository connected
                    </p>
                  )}
                </div>
              </div>

              {repository ? (
                <button
                  type="button"
                  onClick={handleGithubMenuOpen}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-default bg-card px-3 py-2 text-xs font-medium text-primary transition-fast hover:border-brand hover:bg-accent hover:text-brand"
                >
                  Change
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGithubMenuOpen}
                  disabled={!githubConnected}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-default bg-card px-3 py-2 text-xs font-medium text-primary transition-fast hover:border-brand hover:bg-accent hover:text-brand disabled:pointer-events-none disabled:opacity-50"
                >
                  <Plus size={14} />
                  Connect repository
                </button>
              )}
            </div>

            {showRepositories && (
              <>
                <div className="border-t border-default" />

                {githubLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-default border-t-brand" />
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="mb-2 px-2">
                      <p className="text-xs font-medium text-primary">
                        Select repository
                      </p>

                      <p className="mt-1 text-xs text-secondary">
                        Choose a repository from your connected GitHub account.
                      </p>
                    </div>

                    <div className="max-h-[280px] space-y-1 overflow-y-auto pr-1">
                      {githubRepos?.map((repo: any) => {
                        const isConnected = projectRepos?.some(
                          (projectRepo) => projectRepo?.repoId === repo?.id,
                        );

                        const isSelecting = selectingRepoId === repo.id;

                        return (
                          <button
                            key={repo.id}
                            type="button"
                            disabled={isSelecting}
                            onClick={() => handleRepositorySelect(repo)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-fast hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <Github
                                size={15}
                                className="shrink-0 text-secondary"
                              />

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-primary">
                                  {repo?.name}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-secondary">
                                  {repo?.fullName}
                                </p>
                              </div>
                            </div>

                            {isSelecting ? (
                              <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-default border-t-brand" />
                            ) : isConnected ? (
                              <span className="shrink-0 rounded-md border border-brand/30 bg-brand/5 px-2 py-1 text-[10px] font-medium text-brand">
                                Connected
                              </span>
                            ) : repo.private ? (
                              <span className="shrink-0 rounded-md border border-default bg-secondary/30 px-2 py-1 text-[10px] font-medium text-secondary">
                                Private
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {repository && !showRepositories && (
              <>
                <div className="border-t border-default" />

                <div className="flex items-center justify-between gap-6 px-5 py-4">
                  <div>
                    <p className="text-xs font-medium text-primary">
                      Repository
                    </p>

                    <p className="mt-1 text-xs text-secondary">
                      {repository.repoFullName}
                    </p>
                  </div>

                  <a
                    href={`https://github.com/${repository.repoFullName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-secondary transition-fast hover:text-brand"
                  >
                    View on GitHub
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div className="border-t border-default" />

                <div className="flex items-center justify-between gap-6 px-5 py-4">
                  <div>
                    <p className="text-xs font-medium text-primary">
                      Repository ID
                    </p>

                    <p className="mt-1 text-xs text-secondary">
                      {repository.repoId}
                    </p>
                  </div>

                  <span className="rounded-md border border-default bg-secondary/30 px-2 py-1 text-[10px] font-medium text-secondary">
                    Connected
                  </span>
                </div>
              </>
            )}
          </div>

          {!githubConnected && (
            <div className="rounded-lg border border-default bg-secondary/10 px-4 py-3">
              <p className="text-xs text-secondary">
                Connect GitHub from workspace integrations before selecting a
                repository.
              </p>
            </div>
          )}
        </section>

        {/* {repository && (
          <>
            <div className="my-8 border-t border-default" />

            <section className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-primary">
                  Issue automation
                </h2>

                <p className="mt-1 text-sm text-secondary">
                  Configure how GitHub activity should update issues in this
                  project.
                </p>
              </div>

              <div className="rounded-xl border border-default bg-card">
                <div className="flex items-center justify-between px-5 py-5">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      GitHub rules
                    </p>

                    <p className="mt-1 text-xs text-secondary">
                      Automatically update issues based on GitHub activity.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-default bg-card px-3 py-2 text-xs font-medium text-primary transition-fast hover:border-brand hover:bg-accent hover:text-brand"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </section>
          </>
        )} */}
      </div>
    </main>
  );
}
