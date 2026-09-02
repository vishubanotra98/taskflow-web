"use client";

import DescriptionEditor from "@/components/Common/TextEditor";
import { priorityList } from "@/utils/constants";
import { commonSelectStyles2 } from "@/utils/styles";
import {
  AlertCircle,
  ArrowLeft,
  CalendarCheck2,
  CalendarIcon,
  Check,
  CircleDot,
  Flag,
  Loader2,
  Trash2,
  UserRound,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import { DeleteModal } from "./DeleteModal";
import { useAppDispatch } from "@/Store/hooks";

import {
  editIssueAction,
  fetchGithubHistoryAction,
  fetchIssuesByProjectAction,
  fetchWorkspaceMambersAction,
  fetchWorkspaceStatusAction,
} from "@/Store/actions/workspace.action";

import IssueNotFound from "./IssueNotFound";
import IssueLoading from "./IssueLoading";

import {
  AssigneeControl,
  CustomOption,
  CustomSingleValue,
  PriorityPlaceholder,
  StatusPlaceholder,
} from "../Common";

import { Params } from "@/types/types";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";
import { format } from "date-fns";
import { Textarea } from "../textarea";
import IssueGithubHistory from "./GithubHistory";

type SaveState = "idle" | "saving" | "saved" | "error";

const SaveIndicator = ({ state }: { state: SaveState }) => {
  if (state === "saving") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-secondary">
        <Loader2 size={12} className="animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-destructive">
        <AlertCircle size={12} />
        <span>Couldn&apos;t save</span>
      </div>
    );
  }

  if (state === "saved") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-secondary">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/10">
          <Check size={10} className="text-success" />
        </span>

        <span>Saved</span>
      </div>
    );
  }

  return null;
};

export const IssuePageClient = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { workspaceId, teamId, projectId, issueId } = useParams<Params>();
  const searchParams = useSearchParams();
  const fromDashboard = Boolean(searchParams.get("dashboard"));

  const [issueState, setIssueState] = useState({
    assigneeId: "",
    description: "",
    id: null,
    priority: "",
    projectId: "",
    statusId: "",
    ticket_num: null,
    title: "",
    blockedReason: "",
    targetDate: undefined,
  });
  const [members, setMembers] = useState<any>(null);
  const [statusList, setStatusList] = useState<any>(null);
  const [githubHistory, setGithubHistory] = useState<any>([]);
  const [isLoadingIssue, setIsLoadingIssue] = useState(true);
  const [open, setOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const [saveState, setSaveState] = useState<SaveState>("idle");

  const {
    title,
    description,
    priority,
    statusId,
    assigneeId,
    blockedReason,
    targetDate,
  } = issueState;

  const selectedStatus = useMemo(() => {
    return statusList?.find((status: any) => status?.id === statusId);
  }, [statusList, statusId]);

  const isBlocked = Boolean(selectedStatus?.isBlocked);

  useEffect(() => {
    if (!workspaceId || !projectId || !issueId) {
      return;
    }

    const init = async () => {
      try {
        setIsLoadingIssue(true);

        const [
          issuesRes,
          githubHistoryRes,
          workspaceStatusRes,
          membersRes,
        ]: any = await Promise.all([
          dispatch(fetchIssuesByProjectAction({ projectId })).unwrap(),
          dispatch(fetchGithubHistoryAction(issueId)).unwrap(),
          dispatch(
            fetchWorkspaceStatusAction({
              workspaceId,
              projectId,
            }),
          ).unwrap(),

          dispatch(fetchWorkspaceMambersAction(workspaceId)).unwrap(),
        ]);

        const issuesData = issuesRes?.data?.issues ?? [];
        const membersList = membersRes?.data?.members ?? [];
        const statusRes = workspaceStatusRes?.data?.status ?? [];
        const githubHistory = githubHistoryRes?.data?.histories ?? [];

        const selectedIssue =
          issuesData?.find((issue: any) => issue?.id === issueId) ?? null;

        const membersData = membersList?.map((mem: any) => {
          const name =
            mem?.user?.name ||
            [mem?.user?.firstName, mem?.user?.lastName]
              .filter(Boolean)
              .join(" ");

          return {
            userId: mem?.user?.id,
            role: mem?.role,
            name,
            email: mem?.user?.email,
          };
        });

        if (selectedIssue) {
          setIssueState({
            ...selectedIssue,
          });
        }

        setMembers(membersData);
        setStatusList(statusRes);
        setGithubHistory(githubHistory);
      } catch (error) {
        console.error("Failed to load issue:", error);
      } finally {
        setIsLoadingIssue(false);
      }
    };

    init();
  }, [dispatch, workspaceId, projectId, issueId]);

  useEffect(() => {
    if (!issueState?.id) {
      return;
    }

    setSaveState("saving");

    const delayDebounce = setTimeout(async () => {
      try {
        const payload = {
          workspaceId,
          teamId,
          projectId,
          issueId,
          title: title || null,
          description: description || null,
          assigneeId: assigneeId || null,
          priority: priority || null,
          statusId: statusId || null,
          targetDate: targetDate || null,
          blockedReason: blockedReason || null,
        };

        await dispatch(editIssueAction(payload)).unwrap();

        setSaveState("saved");
      } catch (error) {
        console.error("Failed to save issue:", error);
        setSaveState("error");
      }
    }, 800);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [
    workspaceId,
    teamId,
    projectId,
    issueId,
    dispatch,
    issueState?.id,
    title,
    description,
    assigneeId,
    priority,
    statusId,
    targetDate,
    blockedReason,
  ]);

  const handleBack = () => {
    if (fromDashboard) {
      router.push(`/${workspaceId}/dashboard`);
      return;
    }
    router.push(`/${workspaceId}/team/${teamId}/project/${projectId}`);
  };

  if (isLoadingIssue) {
    return <IssueLoading />;
  }

  if (!issueState?.id) {
    return <IssueNotFound />;
  }

  return (
    <div className="min-h-screen w-full bg-background text-primary">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="soft"
              size="sm"
              className="group gap-1.5 px-2.5 font-medium"
              onClick={handleBack}
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.8}
                className="transition-transform duration-150 group-hover:-translate-x-0.5"
              />
              Back
            </Button>

            <span className="hidden text-secondary/60 sm:block">/</span>

            <span className="hidden truncate text-xs font-medium text-secondary sm:block">
              {issueState?.ticket_num ? `${issueState.ticket_num}` : "Issue"}
            </span>

            <SaveIndicator state={saveState} />
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:px-8 lg:py-12">
          <section className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary">
                Issue
              </span>

              {issueState?.ticket_num && (
                <>
                  <span className="text-secondary/60">·</span>

                  <span className="text-[11px] font-medium tabular-nums text-secondary">
                    #{issueState.ticket_num}
                  </span>
                </>
              )}
            </div>

            <textarea
              value={issueState?.title ?? ""}
              onChange={(event) => {
                const newValue = event.target.value;

                setIssueState((prev: any) => ({
                  ...prev,
                  title: newValue,
                }));
              }}
              rows={1}
              autoFocus
              placeholder="Give this issue a title..."
              aria-label="Issue title"
              className="block min-h-[56px] w-full resize-none overflow-hidden rounded-lg border border-transparent bg-transparent px-2 py-1 text-[32px] font-semibold leading-[1.2] tracking-[-0.025em] text-primary outline-none transition-all duration-150 placeholder:text-secondary/60 hover:border-default hover:bg-card/30 focus:border-default focus:bg-card/50"
            />

            <div className="mt-12">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-primary">
                  Description
                </h2>

                <p className="mt-1 text-xs leading-5 text-secondary">
                  Add context, requirements, or notes for your team.
                </p>
              </div>

              <div className="min-h-[320px] rounded-xl border border-default bg-card/50 px-5 py-4 transition-all duration-150 hover:bg-card/50 focus-within:border-brand/40 focus-within:bg-card/60 focus-within:ring-2 focus-within:ring-brand/10">
                <DescriptionEditor
                  state={issueState}
                  setState={setIssueState}
                  isEditing={true}
                />
              </div>
            </div>

            <IssueGithubHistory histories={githubHistory} />
          </section>

          <aside className="min-w-0">
            <div className="sticky top-[78px]">
              <div className="overflow-hidden rounded-xl border border-default bg-card/40">
                <div className="border-b border-default bg-card/60 px-4 py-4">
                  <h2 className="text-sm font-semibold text-primary">
                    Details
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-secondary">
                    Manage issue properties
                  </p>
                </div>

                <div className="divide-y divide-default">
                  <div className="px-4 py-4">
                    <label className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                      <UserRound
                        size={13}
                        strokeWidth={1.8}
                        className="text-secondary"
                      />
                      Assignee
                    </label>

                    <Select
                      options={members}
                      onChange={(value: any) => {
                        setIssueState((prev: any) => ({
                          ...prev,
                          assigneeId: value?.userId ?? "",
                        }));
                      }}
                      value={
                        members?.find(
                          (member: any) =>
                            member?.userId === issueState?.assigneeId,
                        ) || null
                      }
                      getOptionValue={(value: any) => value.userId}
                      getOptionLabel={(value: any) => value.name}
                      placeholder="Assign to someone"
                      styles={commonSelectStyles2}
                      components={{
                        Control: AssigneeControl,
                      }}
                      isClearable
                      isSearchable={false}
                    />
                  </div>

                  <div className="px-4 py-4">
                    <label className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                      <CircleDot
                        size={13}
                        strokeWidth={1.8}
                        className="text-secondary"
                      />
                      Status
                    </label>

                    <Select
                      options={statusList}
                      onChange={(value: any) => {
                        setIssueState((prev: any) => ({
                          ...prev,
                          statusId: value?.id ?? "",
                        }));
                      }}
                      value={
                        statusList?.find(
                          (status: any) => status?.id === issueState?.statusId,
                        ) || null
                      }
                      getOptionValue={(value: any) => value.id}
                      getOptionLabel={(value: any) => value.name}
                      placeholder="Select status"
                      styles={commonSelectStyles2}
                      components={{
                        Option: CustomOption,
                        SingleValue: CustomSingleValue,
                        Placeholder: StatusPlaceholder,
                      }}
                      isClearable={false}
                      isSearchable={false}
                    />
                  </div>

                  <div className="px-4 py-4">
                    <label className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                      <Flag
                        size={13}
                        strokeWidth={1.8}
                        className="text-secondary"
                      />
                      Priority
                    </label>

                    <Select
                      options={priorityList}
                      onChange={(value: any) => {
                        setIssueState((prev: any) => ({
                          ...prev,
                          priority: value?.value ?? "",
                        }));
                      }}
                      value={
                        priorityList.find(
                          (item: any) => item?.value === issueState?.priority,
                        ) || null
                      }
                      getOptionValue={(value: any) => value.value}
                      getOptionLabel={(value: any) => value.label}
                      placeholder="Set priority"
                      styles={commonSelectStyles2}
                      components={{
                        Option: CustomOption,
                        SingleValue: CustomSingleValue,
                        Placeholder: PriorityPlaceholder,
                      }}
                      isClearable
                      isSearchable
                    />
                  </div>

                  <div className="px-4 py-4">
                    <label className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                      <CalendarCheck2
                        size={13}
                        strokeWidth={1.8}
                        className="text-secondary"
                      />
                      Target date
                    </label>

                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-10 w-full justify-start rounded-lg border border-default bg-background/50 px-3 text-sm font-normal hover:bg-accent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />

                          {targetDate ? (
                            <span className="text-primary">
                              {format(targetDate, "dd MMM yyyy")}
                            </span>
                          ) : (
                            <span className="text-secondary">
                              No target date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-auto rounded-xl border border-default bg-popover p-3 bg-card shadow-card"
                      >
                        <Calendar
                          mode="single"
                          selected={targetDate ?? undefined}
                          onSelect={(selectedDate) => {
                            setIssueState((prev: any) => ({
                              ...prev,
                              targetDate: selectedDate,
                            }));

                            if (selectedDate) {
                              setDateOpen(false);
                            }
                          }}
                          captionLayout="label"
                        />

                        <div className="mt-3 flex items-center justify-between border-t border-default pt-3">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIssueState((prev) => ({
                                ...prev,
                                targetDate: undefined,
                              }));

                              setDateOpen(false);
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {isBlocked && (
                    <div className="px-4 py-4">
                      <div className="mb-3">
                        <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                          <AlertCircle
                            size={13}
                            strokeWidth={1.8}
                            className="text-warning"
                          />
                          Blocked reason
                        </label>

                        <p className="mt-1.5 text-[11px] leading-4 text-secondary">
                          Explain what is preventing this issue from moving
                          forward.
                        </p>
                      </div>

                      <Textarea
                        value={blockedReason ?? ""}
                        onChange={(event) => {
                          setIssueState((prev: any) => ({
                            ...prev,
                            blockedReason: event.target.value,
                          }));
                        }}
                        rows={5}
                        placeholder="e.g. Waiting for API credentials from the client..."
                        aria-label="Blocked reason"
                        className="resize-none rounded-lg border-border bg-background/40 text-sm placeholder:text-secondary/60 focus:border-warning/50 focus:ring-warning/10"
                      />

                      <p className="mt-1.5 text-[11px] leading-4 text-secondary">
                        This helps your team understand the blocker.
                      </p>
                    </div>
                  )}

                  <div className="px-4 py-4">
                    <Button
                      className="h-9 w-full justify-center gap-1.5 rounded-lg text-xs font-medium"
                      variant="delete"
                      onClick={() => setOpen(true)}
                    >
                      <Trash2 size={13} strokeWidth={2} />
                      Move to trash
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-3 px-1">
                <p className="text-[11px] leading-4 text-secondary">
                  Changes are saved automatically.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <DeleteModal open={open} setOpen={setOpen} />
    </div>
  );
};
