"use client";

import { Modal } from "@/components/Common/Modal";
import { UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { AddTeamForm } from "../Forms/TeamForm/AddTeamForm";

export default function DashboardButton() {
  const [teamModal, setTeamModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Modal
        buttonClassName=""
        buttonInnerText={
          <span className="flex items-center justify-center gap-1.5">
            <Users size={14} />
            Create Team
          </span>
        }
        open={teamModal}
        setOpen={() => setTeamModal((prev) => !prev)}
        title="Add New Team"
        body={
          <>
            <AddTeamForm />
          </>
        }
      />

      <Modal
        buttonClassName=""
        buttonInnerText={
          <span className="flex items-center justify-center gap-1.5">
            <UserPlus size={14} />
            Invite Member
          </span>
        }
        open={userModal}
        setOpen={() => setUserModal((prev) => !prev)}
        title="Add New Team"
        body={
          <>
            <h1>THis is Body</h1>
          </>
        }
      />
    </div>
  );
}
