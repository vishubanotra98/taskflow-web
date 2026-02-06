"use server";

import { executeAction } from "@/lib/executeAction";
import { WorkspaceNameType } from "@/lib/schema";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
