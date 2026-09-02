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
        <span>Couldn't save</span>
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

        const [issuesRes, workspaceStatusRes, membersRes] = await Promise.all([
          dispatch(fetchIssuesByProjectAction({ projectId })).unwrap(),

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
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-20 border-b border-default bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant={"soft"}
              className="flex items-center justify-center gap-1.5 py-1"
              onClick={handleBack}
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-150
                  group-hover:-translate-x-0.5
                "
              />
              Back
            </Button>

            <span className="hidden text-secondary/30 sm:block">/</span>

            <span className="hidden truncate text-xs font-medium text-secondary sm:block">
              {issueState?.ticket_num ? issueState?.ticket_num : "Issue"}
            </span>

            <SaveIndicator state={saveState} />
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 lg:px-8 lg:py-10">
          <section className="min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                Issue
              </span>

              {issueState?.ticket_num && (
                <>
                  <span className="text-xs text-secondary/30">•</span>

                  <span className="text-xs font-medium text-secondary">
                    {issueState.ticket_num}
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
              className="block min-h-[52px] w-full resize-none overflow-hidden rounded-lg border border-transparent bg-transparent px-2 py-1 text-3xl font-semibold leading-tight tracking-tight text-primary outline-none transition-all duration-150 hover:border-default hover:bg-card/40 focus:border-default focus:bg-card"
            />

            <div className="mt-10">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    Description
                  </h2>

                  <p className="mt-1 text-xs text-secondary/60">
                    Add context, requirements, or notes for your team.
                  </p>
                </div>
              </div>

              <div className="min-h-[320px] rounded-xl border border-default bg-card/40 px-5 py-4 transition-all duration-150 hover:bg-card/60 focus-within:border-brand/60 focus-within:bg-card focus-within:ring-2 focus-within:ring-brand/10">
                <DescriptionEditor
                  state={issueState}
                  setState={setIssueState}
                  isEditing={true}
                />
              </div>
            </div>
          </section>

          <aside className="min-w-0">
            <div className="sticky top-[78px]">
              <div className=" overflow-hidden rounded-xl border border-default bg-card/60 shadow-md">
                <div className="border-b border-default px-5 py-4">
                  <h2 className="text-sm font-semibold text-primary">
                    Details
                  </h2>

                  <p className="mt-1 text-xs text-secondary">
                    Manage issue properties
                  </p>
                </div>

                <div className="space-y-5 p-5">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-medium text-secondary">
                      <UserRound size={13} strokeWidth={1.8} />
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

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-medium text-secondary">
                      <CircleDot size={13} strokeWidth={1.8} />
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

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-medium text-secondary">
                      <Flag size={13} strokeWidth={1.8} />
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

                  <div className="space-y-1.5">
                    <label className="mb-2 flex items-center gap-2 text-xs font-medium text-secondary">
                      <CalendarCheck2 size={13} strokeWidth={1.8} />
                      Target Date
                    </label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-12 w-full justify-start font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />

                          {targetDate ? (
                            <span>{format(targetDate, "dd MMM yyyy")}</span>
                          ) : (
                            <span className="text-secondary">
                              No target date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-auto rounded-lg border border-default bg-card p-3 shadow-card"
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

                  <div className="space-y-1.5">
                    <Button
                      className="w-full flex justify-center items-center gap-1 font-semibold py-1"
                      variant={"delete"}
                      onClick={() => setOpen(true)}
                    >
                      <Trash2 size={13} strokeWidth={3} />
                      Delete
                    </Button>
                  </div>

                  {isBlocked && (
                    <div className="border-t border-default pt-5">
                      <div className="mb-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-secondary">
                          <AlertCircle
                            size={13}
                            strokeWidth={1.8}
                            className="text-warning"
                          />
                          Blocked reason
                        </label>

                        <p className="mt-1 text-[11px] leading-4 text-secondary/60">
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
                      />

                      <p className="mt-1.5 text-[11px] text-secondary/60">
                        This will help your team understand the blocker from the
                        dashboard.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 px-1">
                <p className="text-[11px] leading-4 text-secondary/60">
                  Changes are saved automatically. You don't need to manually
                  save this issue.
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
