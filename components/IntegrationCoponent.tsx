"use client";

import { useEffect } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  GITHUB_ALREADY_INTEGRATED:
    "This workspace already has a GitHub account connected.",
  GITHUB_AUTH_FAILED: "We couldn't authenticate with GitHub. Please try again.",
  INVALID_OAUTH_STATE:
    "This connection request expired or is invalid. Please try again.",
};

const DEFAULT_ERROR_MESSAGE =
  "Something went wrong while connecting your GitHub account.";

export const Integration = () => {
  const searchParams = useSearchParams();

  const githubConnected = searchParams.get("githubconnected");
  const workspaceId = searchParams.get("workspaceId");
  const error = searchParams.get("error");

  const status: "pending" | "success" | "error" =
    githubConnected === "true"
      ? "success"
      : githubConnected === "false"
        ? "error"
        : "pending";

  useEffect(() => {
    if (status === "pending") return;

    if (window.opener) {
      window.opener.postMessage(
        {
          type: "github-oauth-complete",
          success: status === "success",
          workspaceId,
          error,
        },
        window.location.origin,
      );

      const timer = setTimeout(
        () => window.close(),
        status === "success" ? 1000 : 2500,
      );
      return () => clearTimeout(timer);
    }
  }, [status, workspaceId, error]);

  const errorMessage = error
    ? (ERROR_MESSAGES[error] ?? DEFAULT_ERROR_MESSAGE)
    : DEFAULT_ERROR_MESSAGE;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex size-10 items-center justify-center rounded-xl border shadow-card ${
            status === "success"
              ? "border-brand/30 bg-brand/5"
              : status === "error"
                ? "border-destructive/30 bg-destructive/5"
                : "border-default bg-card"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 size={18} strokeWidth={2} className="text-brand" />
          ) : status === "error" ? (
            <XCircle size={18} strokeWidth={2} className="text-destructive" />
          ) : (
            <Loader2
              size={18}
              strokeWidth={2}
              className="animate-spin text-brand"
            />
          )}
        </div>

        <h2 className="mt-4 text-sm font-semibold text-primary">
          {status === "success"
            ? "Connected successfully"
            : status === "error"
              ? "Connection failed"
              : "Connecting integration"}
        </h2>

        <p className="mt-1.5 max-w-sm text-xs leading-5 text-secondary">
          {status === "success"
            ? "GitHub is now linked to your workspace. This window will close automatically."
            : status === "error"
              ? errorMessage
              : "We're completing the connection and setting things up for your workspace."}
        </p>

        {status === "error" && (
          <button
            type="button"
            onClick={() => window.close()}
            className="mt-4 rounded-lg border border-default bg-card px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:border-brand hover:bg-accent hover:text-brand"
          >
            Close window
          </button>
        )}
      </div>
    </div>
  );
};
