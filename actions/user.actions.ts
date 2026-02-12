"use server";

import { executeAction } from "@/lib/executeAction";
import { WorkspaceNameType } from "@/lib/schema";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const createWorkspaceAction = async (
  data: WorkspaceNameType,
  userId: string,
) => {
  return executeAction({
    actionFn: async () => {
      const workspace = await prisma.workspace.create({
        data: {
          name: data.name,
          members: {
            create: {
              userId: userId,
              role: "ADMIN",
            },
          },
        },
      });

      revalidatePath("/");
      redirect(`/${workspace.id}/dashboard`);
    },
    successMessage: "Workspace created successfully.",
  });
};

export const createTeamAction = async (
  teamName: string,
  workspaceId: string,
) => {
  return executeAction({
    actionFn: async () => {
      const session = await auth();
      const user = session?.user;

      if (!user?.id) {
        throw new Error("Unauthorised");
      }

      const membership = await prisma.workspaceMembers?.findFirst({
        where: { userId: user?.id },
      });

      if (!membership) {
        throw new Error("You are not member of this workspace");
      }

      const team = await prisma.team.create({
        data: {
          name: teamName,
          workspaceId,
          members: {
            create: {
              userId: user?.id,
            },
          },
        },
      });

      revalidatePath(`${workspaceId}/dashboard`);
      return team;
    },
    successMessage: "Team created successfully.",
  });
};

export const createProjectAction = async (
  projectName: string,
  teamId: string,
) => {
  return executeAction({
    successMessage: "Project created successfully.",
    actionFn: async () => {
      const session = await auth();
      const user = session?.user;

      if (!user?.id) {
        throw new Error("Unauthorized");
      }

      const membership = await prisma.teamMembers.findFirst({
        where: {
          teamId: teamId,
          userId: user.id,
        },
        include: {
          team: true,
        },
      });

      if (!membership) {
        throw new Error(
          "You must be a member of this team to create a project.",
        );
      }

      const workspaceId = membership.team.workspaceId;

      const project = await prisma.project.create({
        data: {
          name: projectName,
          teamId: teamId,
        },
      });

      revalidatePath(`/${workspaceId}/dashboard`);

      return project;
    },
  });
};
