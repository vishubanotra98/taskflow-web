import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

const IssueGithubHistory = ({ histories }: any) => {
  const pullRequests = histories
    .filter((history: any) => history.type === "PULL_REQUEST")
    .sort(
      (a: any, b: any) =>
        new Date(b.closedAt ?? 0).getTime() -
        new Date(a.closedAt ?? 0).getTime(),
    );

  const commits = histories
    .filter((history: any) => history.type === "PUSH" && history.commits)
    .sort(
      (a: any, b: any) =>
        new Date(b.commits?.timestamp ?? b.pushedAt ?? 0).getTime() -
        new Date(a.commits?.timestamp ?? a.pushedAt ?? 0).getTime(),
    );

  if (!histories.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-primary">GitHub</h2>

        <p className="mt-1 text-xs leading-5 text-secondary">
          Pull requests and commits associated with this issue.
        </p>
      </div>

      <div className="relative">
        <div className="absolute bottom-2 left-[15px] top-2 w-px bg-border" />

        <div className="space-y-6">
          {pullRequests.map((pr: any) => (
            <div key={pr.id} className="relative flex gap-4">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-default bg-background">
                <GitPullRequest
                  size={14}
                  strokeWidth={1.8}
                  className="text-brand"
                />
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-secondary">
                        Pull request merged
                      </span>

                      <CheckCircle2
                        size={13}
                        strokeWidth={1.8}
                        className="text-success"
                      />
                    </div>

                    <p className="mt-1 text-sm font-medium text-primary">
                      {pr.title ?? "Pull request"}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-secondary">
                      {pr.pullReqId && <span>#{pr.pullReqId}</span>}

                      {pr.head && pr.base && (
                        <>
                          <span className="text-secondary/60">•</span>

                          <span className="inline-flex items-center gap-1.5">
                            <GitBranch size={11} />

                            <span>{pr.head}</span>

                            <span className="text-secondary/60">→</span>

                            <span>{pr.base}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {pr.closedAt && (
                    <span className="shrink-0 text-[11px] text-secondary">
                      {formatRelativeDate(pr.closedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {commits.length > 0 && (
            <div className="relative flex gap-4">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-default bg-background">
                <GitCommit size={14} strokeWidth={1.8} className="text-brand" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">
                    Commits
                  </span>

                  <span className="rounded-full border border-default bg-secondary/30 px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                    {commits.length}
                  </span>
                </div>

                <div className="overflow-hidden rounded-lg border border-default bg-card/60">
                  {commits.map((history: any, index: any) => {
                    const commit = history.commits;
                    if (!commit) return null;
                    const commitUrl = commit.url;
                    const message =
                      commit.message?.split("\n")[0]?.trim() || "Commit";
                    const author = commit.author?.name;
                    const timestamp = commit.timestamp ?? history.pushedAt;
                    return (
                      <div
                        key={history.id}
                        className={`group px-4 py-3 transition-colors hover:bg-card/70 ${
                          index !== commits.length - 1
                            ? "border-b border-default"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <GitCommit
                            size={14}
                            strokeWidth={1.8}
                            className="mt-0.5 shrink-0 text-secondary"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                {commitUrl ? (
                                  <a
                                    href={commitUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/link inline-flex max-w-full items-center gap-1.5"
                                  >
                                    <span className="truncate text-sm text-primary transition-colors group-hover/link:text-brand">
                                      {message}
                                    </span>

                                    <ExternalLink
                                      size={11}
                                      className="shrink-0 text-secondary opacity-0 transition-opacity group-hover/link:opacity-100"
                                    />
                                  </a>
                                ) : (
                                  <p className="truncate text-sm text-primary">
                                    {message}
                                  </p>
                                )}

                                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-secondary">
                                  {commit.id && (
                                    <span className="font-mono">
                                      {commit.id.slice(0, 7)}
                                    </span>
                                  )}

                                  {author && (
                                    <>
                                      <span className="text-secondary/60">
                                        •
                                      </span>

                                      <span>{author}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {timestamp && (
                                <span className="shrink-0 text-[11px] text-secondary">
                                  {formatRelativeDate(timestamp)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const formatRelativeDate = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days}d ago`;
  }

  return new Date(date).toLocaleDateString();
};

export default IssueGithubHistory;
