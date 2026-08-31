"use client";

import {
  fetchActivitiesAction,
  fetchTeamsDataAction,
  permanentDeleteProjectAction,
  permanentDeleteTeamAction,
  restoreProjectAction,
  restoreTeamAction,
} from "@/Store/actions/workspace.action";
import { useAppDispatch } from "@/Store/hooks";
import {
  Archive,
  FolderKanban,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../button";
import { NewDeleteModal } from "@/components/Common/DeleteModal";
import { Spinner } from "../Spinner/spinner";
import { SuccessToast } from "../Toast/SuccessToast";
import { ErrorToast } from "../Toast/ErrorToast";
import { useParams } from "next/navigation";

const formatDeletedAt = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })?.format(new Date(date));
};

export default function TrashContentTab({
  deletedProjects,
  deletedTeams,
  fetchData,
}: any) {
  const dispatch = useAppDispatch();
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "team" | "project";
    id: string;
    name: string;
  } | null>(null);

  const [deleteSpin, setDeleteSpin] = useState(false);
  const [projectSpin, setProjectSpin] = useState(false);
  const [teamSpin, setTeamSpin] = useState(false);
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  const onPermanentDeleteTeam = async (teamId: string) => {
    const res = await dispatch(permanentDeleteTeamAction(teamId)).unwrap();
    if (res?.success) {
      toast.custom((t) => (
        <SuccessToast t={t} title="Success" description={"Team deleted."} />
      ));
    } else {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Error"
          description="Failed to delete the team."
        />
      ));
    }
  };

  const onPermanentDeleteProject = async (projectId: string) => {
    const res = await dispatch(
      permanentDeleteProjectAction(projectId),
    ).unwrap();
    if (res?.success) {
      toast.custom((t) => (
        <SuccessToast t={t} title="Success" description={"Project deleted."} />
      ));
    } else {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          description="Failed to delete the project."
          title="Error"
        />
      ));
    }
  };

  const onRestoreTeam = async (teamId: string) => {
    setTeamSpin(true);
    const res = await dispatch(restoreTeamAction(teamId)).unwrap();
    if (res?.success) {
      toast.custom((t) => (
        <SuccessToast t={t} title="Success" description={"Team restored."} />
      ));
    } else {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          description="Failed to restore the team."
          title="Error"
        />
      ));
    }
    await fetchData();
    await dispatch(fetchTeamsDataAction(workspaceId));
    await dispatch(fetchActivitiesAction(workspaceId));
    setTeamSpin(false);
  };

  const onRestoreProject = async (projectId: string) => {
    setProjectSpin(true);
    const res = await dispatch(restoreProjectAction(projectId)).unwrap();
    // await dispatch(fetchTeamsDataAction(workspaceId));
    if (res?.success) {
      toast.custom((t) => (
        <SuccessToast t={t} title="Success" description={"Project restored."} />
      ));
    } else {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Error"
          description="Failed to restore the project."
        />
      ));
    }
    await fetchData();
    setProjectSpin(false);
  };

  const handlePermanentDelete = async () => {
    if (!confirmDelete) return;

    setDeleteSpin(true);
    if (confirmDelete.type === "team") {
      await onPermanentDeleteTeam?.(confirmDelete.id);
    } else {
      await onPermanentDeleteProject?.(confirmDelete.id);
    }
    await fetchData();
    setDeleteSpin(false);
    setConfirmDelete(null);
  };

  const hasTeams = deletedTeams?.length > 0;
  const hasProjects = deletedProjects?.length > 0;
  const isEmpty = !hasTeams && !hasProjects;

  return (
    <>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Trash2 size={16} className="text-brand" />
            </div>

            <h2 className="text-base font-semibold text-primary">Trash</h2>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-secondary">
            Deleted teams and projects are kept here until they are permanently
            removed. Restore them whenever you need to bring them back.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-card border border-default bg-secondary/40 px-4 py-3.5">
          <ShieldAlert size={17} className="mt-0.5 shrink-0 text-secondary" />

          <div>
            <p className="text-sm font-medium text-primary">
              Deleted resources are recoverable
            </p>

            <p className="mt-1 text-xs leading-relaxed text-secondary">
              Restoring a resource returns it to its previous workspace
              location. Permanently deleted resources cannot be recovered.
            </p>
          </div>
        </div>

        {isEmpty && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-card border border-default bg-card px-6 text-center shadow-card">
            <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
              <Archive size={20} className="text-secondary" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-primary">
              Trash is empty
            </h3>

            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-secondary">
              Deleted teams and projects will appear here and can be restored
              before permanent deletion.
            </p>
          </div>
        )}

        {hasProjects && (
          <TrashSection
            title="Projects"
            description="Deleted projects from your workspace."
            icon={<FolderKanban size={17} />}
            count={deletedProjects?.length}
          >
            <div className="overflow-hidden rounded-card border border-default bg-card shadow-card">
              {deletedProjects?.map((project: any, index: any) => {
                return (
                  <TrashItem
                    key={project.id}
                    name={project.name}
                    metadata={
                      project.team?.name
                        ? `${project.team?.name} • Deleted ${formatDeletedAt(
                            project.deletedAt,
                          )}`
                        : `Deleted ${formatDeletedAt(project.deletedAt)}`
                    }

                    isLast={index === deletedProjects.length - 1}
                    onRestore={() => onRestoreProject?.(project.id)}
                    onDelete={() =>
                      setConfirmDelete({
                        type: "project",
                        id: project.id,
                        name: project.name,
                      })
                    }
                    load={projectSpin}
                  />
                );
              })}
            </div>
          </TrashSection>
        )}

        {hasTeams && (
          <TrashSection
            title="Teams"
            description="Deleted teams from your workspace."
            icon={<Users size={17} />}
            count={deletedTeams?.length}
          >
            <div className="overflow-hidden rounded-card border border-default bg-card shadow-card">
              {deletedTeams.map((team: any, index: any) => (
                <TrashItem
                  key={team.id}
                  name={team.name}
                  metadata={`Deleted ${formatDeletedAt(team.deletedAt)}`}
                  isLast={index === deletedTeams?.length - 1}
                  onRestore={() => onRestoreTeam?.(team.id)}
                  onDelete={() =>
                    setConfirmDelete({
                      type: "team",
                      id: team.id,
                      name: team.name,
                    })
                  }
                  load={teamSpin}
                />
              ))}
            </div>
          </TrashSection>
        )}

        {!isEmpty && (
          <div className="border-t border-default pt-5">
            <p className="max-w-2xl text-xs leading-relaxed text-secondary">
              <span className="font-medium text-primary">
                Permanent deletion
              </span>{" "}
              removes the resource and its associated data permanently. Use this
              only when you are certain the resource is no longer needed.
            </p>
          </div>
        )}
      </div>

      {confirmDelete && (
        <NewDeleteModal
          open={
            confirmDelete?.type === "project" || confirmDelete?.type === "team"
              ? true
              : false
          }
          setOpen={() => {
            setConfirmDelete(null);
          }}
          spin={deleteSpin}
          title={`Permanently delete ${confirmDelete.type}?`}
          subHeading={`“${confirmDelete.name}” will be permanently removed. This action cannot be undone.`}
          handlerButtonText="Delete Permanently"
          disabledText="Deleting..."
          deleteHandler={handlePermanentDelete}
        />
      )}
    </>
  );
}

function TrashSection({
  title,
  description,
  icon,
  count,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <span className="text-secondary">{icon}</span>

            <h3 className="text-sm font-semibold">{title}</h3>

            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary">
              {count}
            </span>
          </div>

          <p className="mt-1 text-xs text-secondary">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function TrashItem({
  name,
  metadata,
  isLast,
  onRestore,
  onDelete,
  load,
}: {
  name: string;
  metadata: string;
  isLast: boolean;
  onRestore: () => void;
  onDelete: () => void;
  load: boolean;
}) {
  return (
    <div
      className={`group flex min-h-[72px] items-center justify-between gap-6 px-5 py-4 transition-fast hover:bg-secondary/5 ${
        !isLast ? "border-b border-default" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <FolderKanban size={16} className="text-secondary" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-primary">{name}</p>

          <p className="mt-0.5 truncate text-xs text-secondary">{metadata}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant={"soft"}
          iconAnimation="flip"
          onClick={onRestore}
          disabled={load}
        >
          {load ? <Spinner color="bg-brand" /> : <RotateCcw size={13} />}
          Restore
        </Button>

        <Button
          type="button"
          onClick={onDelete}
          variant={"delete"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5"
        >
          <Trash2 size={13} />
          Delete Permanently
        </Button>
      </div>
    </div>
  );
}
