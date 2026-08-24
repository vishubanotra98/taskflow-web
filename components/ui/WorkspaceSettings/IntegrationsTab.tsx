"use client";

import { githubStatusAction } from "@/Store/actions/auth.action";
import { useAppDispatch } from "@/Store/hooks";
import { Github, Check, ArrowUpRight, Plug, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  available: boolean;
};

export const IntegrationTab = () => {
  const dispatch = useAppDispatch();

  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "github",
      name: "GitHub",
      description:
        "Connect GitHub to link repositories and bring development activity into your workspace.",
      icon: Github,
      connected: false,
      available: true,
    },
  ]);

  const fetchGithubStatus = async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);

      const res: any = await dispatch(githubStatusAction(workspaceId)).unwrap();

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === "github"
            ? {
                ...integration,
                connected: res?.data?.connected ?? false,
              }
            : integration,
        ),
      );
    } catch (error) {
      console.error("Failed to fetch GitHub integration status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubStatus();
  }, [workspaceId]);

  const handleConnect = (integration: Integration) => {
    if (!integration.available) return;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}auth/login/github?workspaceId=${workspaceId}`,
      "github-oauth",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      console.error("Failed to open GitHub OAuth popup.");
      return;
    }

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== "github-oauth-complete") {
        return;
      }

      window.removeEventListener("message", handleMessage);

      if (event.data.success) {
        await fetchGithubStatus();
      }
    };

    window.addEventListener("message", handleMessage);

    const pollTimer = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(pollTimer);

        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Plug size={16} className="text-brand" />
          </div>

          <h2 className="text-base font-semibold text-primary">Integrations</h2>
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-secondary">
          Connect Subtend with the tools your team already uses.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-primary">
            Available integrations
          </h3>

          <p className="mt-1 text-xs text-secondary">
            Extend your workspace with external tools and services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {integrations.map((integration) => {
            const Icon = integration.icon;

            return (
              <div
                key={integration.id}
                className="group relative overflow-hidden rounded-xl border border-default bg-card p-5 shadow-card transition-all duration-200 hover:border-brand/30"
              >
                <div className="absolute left-0 top-0 h-px w-0 bg-brand transition-all duration-200 group-hover:w-full" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-default bg-secondary/40">
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                        className="text-primary"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-primary">
                          {integration.name}
                        </h4>

                        {loading ? (
                          <Loader2
                            size={13}
                            className="animate-spin text-secondary"
                          />
                        ) : (
                          integration.connected && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-brand/20 bg-brand/5 px-1.5 py-0.5 text-[10px] font-medium text-brand">
                              <Check size={10} />
                              Connected
                            </span>
                          )
                        )}
                      </div>

                      <p className="mt-1.5 text-xs leading-5 text-secondary">
                        {integration.description}
                      </p>
                    </div>
                  </div>

                  {!loading && !integration.connected && (
                    <button
                      type="button"
                      onClick={() => handleConnect(integration)}
                      disabled={integration?.connected}
                      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-default bg-card px-3 py-1.5 text-xs font-medium text-primary transition-all duration-150 hover:border-brand hover:bg-accent hover:text-brand active:scale-[0.98]"
                    >
                      Connect
                      <ArrowUpRight
                        size={13}
                        className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="border-t border-default pt-6">
        <div className="flex max-w-2xl gap-3">
          <div className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary" />

          <p className="text-sm leading-relaxed text-secondary">
            <strong className="font-medium text-primary">
              About integrations:
            </strong>{" "}
            Connected services can access workspace data required to provide
            their integration features. You can disconnect an integration at any
            time.
          </p>
        </div>
      </div>
    </div>
  );
};
