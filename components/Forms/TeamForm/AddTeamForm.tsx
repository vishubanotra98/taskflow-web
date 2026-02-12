"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTeamAction } from "@/actions/user.actions";
import { teamNameSchema, TeamNameType } from "@/lib/schema";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export const AddTeamForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamNameSchema),
  });
  const params = useParams();

  const onSubmit = async ({ teamName }: TeamNameType) => {
    setLoading(true);
    const workspaceId = params?.workspaceId;
    if (typeof workspaceId === "string") {
      const res: any = await createTeamAction(teamName, workspaceId);
      console.log("Team Space:", res);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Team Name</label>
        <Input
          {...register("teamName")}
          placeholder="Eg: Engineering"
          className={`primary-input mt-0.5 ${errors.teamName ? "error" : ""}`}
          required
          maxLength={50}
        />
        {errors.teamName && (
          <p className="text-sm text-red-400">{errors.teamName.message}</p>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          type="submit"
          className="w-full button-primary shadow-lg shadow-indigo-500/20"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Team"}
        </Button>
      </div>
    </form>
  );
};
