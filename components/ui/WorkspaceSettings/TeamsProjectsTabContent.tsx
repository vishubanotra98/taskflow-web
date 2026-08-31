"use client";

import { Users, FolderGit2, Trash2, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/Common/Modal";
import { AddTeamForm } from "@/components/Forms/AddTeamForm";
import { CreateProjectModal } from "@/components/Forms/ProjectForm";
import {
  fetchActivitiesAction,
  fetchTeamsDataAction,
  projectSoftDeleteAction,
  teamSoftDeleteAction,
} from "@/Store/actions/workspace.action";
import toast from "react-hot-toast";
import { NewDeleteModal } from "@/components/Common/DeleteModal";
import { SuccessToast } from "../Toast/SuccessToast";
import { ErrorToast } from "../Toast/ErrorToast";

const TeamsProjectsTabContent = ({ projects, teams, fetchData }: any) => {
  const dispatch = useAppDispatch();
  const {
    workspaceData: { teamsData },
  } = useAppSelector((store: any) => store);

  const [open, setOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [projectDeleteModal, setProjectDeleteMoal] = useState(false);
  const [deleteSpin, setDeleteSpin] = useState(false);

  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const deleteModalhandler = (teamId: string) => {
    setSelectedTeam(teamId);
    setDeleteModal(true);
  };

  const handleSoftDelete = async () => {
    if (!selectedTeam) return;
    try {
      setDeleteSpin(true);

      const res = await dispatch(
        teamSoftDeleteAction(selectedTeam as string),
      ).unwrap();
      if (res?.success) {
        toast.custom((t) => (
          <SuccessToast
            t={t}
            title="Success"
            description={"Team moved to trash."}
          />
        ));
      }
      await dispatch(fetchTeamsDataAction(workspaceId));
      await dispatch(fetchActivitiesAction(workspaceId));
      await fetchData();
    } catch (err) {
      toast.custom((t) => (
        <ErrorToast t={t} title="Error" description={"Error removing team."} />
      ));
    } finally {
      setDeleteSpin(false);
      setDeleteModal(false);
    }
  };

  const handleProjectSoftDelete = async () => {
    if (!selectedProject) return;

    try {
      setDeleteSpin(true);

      const res = await dispatch(
        projectSoftDeleteAction(selectedProject as string),
      ).unwrap();
      if (res?.success) {
        toast.custom((t) => (
          <SuccessToast
            t={t}
            title="Success"
            description={"Project moved to trash."}
          />
        ));
      }
      await dispatch(fetchTeamsDataAction(workspaceId));
      await dispatch(fetchActivitiesAction(workspaceId));
      await fetchData();
    } catch (err) {
      toast.custom((t) => (
        <ErrorToast t={t} description="Error removing project." title="Error" />
      ));
    } finally {
      setDeleteSpin(false);
      setProjectDeleteMoal(false);
    }
  };

  return (
    <div className="space-y-12">
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Users size={16} className="text-brand" />
              </div>

              <h2 className="text-base font-semibold text-primary">
                Manage Teams
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-secondary">
              Manage your teams and their settings.
            </p>
          </div>

          <Modal
            buttonVariant="soft"
            iconAnimate="spin"
            modalWidth="600px"
            buttonInnerText={
              <span className="flex items-center justify-center gap-2">
                <Plus size={15} strokeWidth={2} />
                Create Team
              </span>
            }
            open={open}
            subHeading={
              "Teams help organize people and projects within your workspace."
            }
            setOpen={() => setOpen((prev) => !prev)}
            title="Create Team"
            body={<AddTeamForm setModal={setOpen} />}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-default bg-card shadow-card">
          {teams?.teamData?.length === 0 ? (
            <div className="flex min-h-28 items-center justify-center px-6 text-sm text-secondary">
              No teams found in this workspace.
            </div>
          ) : (
            <ul className="divide-y divide-default">
              {teams?.teamData?.map((team: any) => (
                <li
                  key={team?.id}
                  className=" group flex items-center justify-between gap-6 px-5 py-4 transition-colors duration-150 hover:bg-secondary/5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-default bg-secondary/40">
                      <Users size={15} className="text-secondary" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-primary">
                        {team?.name}
                      </p>

                      <p className="mt-0.5 text-xs text-secondary">
                        {team?.projects?.length}{" "}
                        {team?.projects?.length === 1 ? "project" : "projects"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteModalhandler(team?.id)}

                    type="button"
                    className=" group/delete inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-150 hover:bg-destructive/10 hover:border-destructive/30 active:scale-[0.98] cursor-pointer"
                  >
                    <Trash2
                      size={13}
                      className="transition-transform duration-150 group-hover/delete:scale-105"
                    />
                    Move to trash
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <FolderGit2 size={16} className="text-brand" />
              </div>

              <h2 className="text-base font-semibold text-primary">
                Manage Projects
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-secondary">
              Manage your projects and their settings.
            </p>
          </div>

          <Modal
            open={projectOpen}
            setOpen={setProjectOpen}
            title="Create project"
            body={
              <CreateProjectModal
                fromSettings={true}
                setIsModalOpen={setProjectOpen}
                teamId={""}
                teamsList={teamsData}
                fetchData={fetchData}
              />
            }
            buttonVariant="soft"
            iconAnimate="spin"
            buttonInnerText={
              <span className="flex items-center justify-center gap-2">
                <Plus
                  size={15}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:rotate-90"
                />
                Create Project
              </span>
            }
            subHeading="Organize work, track progress and collaborate."
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-default bg-card shadow-card">
          {projects?.length === 0 ? (
            <div className="flex min-h-28 items-center justify-center px-6 text-sm text-secondary">
              No projects found in this workspace.
            </div>
          ) : (
            <ul className="divide-y divide-default">
              {projects?.map((project: any) => (
                <li
                  key={project?.id}
                  className="group flex items-center justify-between gap-6 px-5 py-4 transition-colors duration-150 hover:bg-secondary/5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-default bg-secondary/40">
                      <FolderGit2 size={15} className="text-secondary" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-primary">
                        {project?.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            project?.deletedAt === null
                              ? "bg-green-300"
                              : "bg-gray-500"
                          }`}
                        />

                        <span className="text-xs text-secondary">
                          {project?.deletedAt === null ? "Active" : "Archived"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProject(project?.id);
                      setProjectDeleteMoal(true);
                    }}
                    type="button"
                    className=" group/delete inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-all duration-150 hover:bg-destructive/10 hover:border-destructive/30 active:scale-[0.98] cursor-pointer
                    "
                  >
                    <Trash2
                      size={13}
                      className="transition-transform duration-150 group-hover/delete:scale-105"
                    />
                    Move to trash
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="border-t border-default pt-6">
        <div className="flex max-w-2xl gap-3">
          <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />

          <p className="text-sm leading-relaxed text-secondary">
            <strong className="font-medium text-primary">
              Note on deletions:
            </strong>{" "}
            Deleting a team or project removes it from view immediately. The
            data is held in a soft-deleted state and will be permanently purged
            according to your workspace data retention policy (default 30 days).
          </p>
        </div>
      </div>

      {deleteModal && (
        <NewDeleteModal
          open={deleteModal}
          setOpen={() => {
            setDeleteModal((prev) => !prev);
            setSelectedTeam(null);
          }}
          spin={deleteSpin}
          title="Move team to trash"
          subHeading="This team will be moved to trash."
          bodyText="You can restore it later, or permanently delete it after the retention period."
          handlerButtonText="Move to trash"
          disabledText="Moving to trash..."
          deleteHandler={handleSoftDelete}
        />
      )}

      {projectDeleteModal && (
        <NewDeleteModal
          open={projectDeleteModal}
          setOpen={() => {
            setProjectDeleteMoal((prev) => !prev);
            setSelectedProject(null);
          }}
          spin={deleteSpin}
          title="Move project to trash"
          subHeading="This project will be moved to trash."
          bodyText="You can restore it later, or permanently delete it after the retention period."
          handlerButtonText="Move to trash"
          disabledText="Moving to trash..."
          deleteHandler={handleProjectSoftDelete}
        />
      )}
    </div>
  );
};

export default TeamsProjectsTabContent;
