"use client";

import { useState } from "react";
import { UserMinus, UserPlus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { nameInitials } from "@/utils/constants";
import { Modal } from "@/components/Common/Modal";
import { InviteMemberForm } from "@/components/Forms/InviteMember";
import Select from "react-select";
import { commonSelectStyles, commonSelectStyles2 } from "@/utils/styles";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  changRoleAction,
  removeUsersAction,
} from "@/Store/actions/user.action";
import { useAppDispatch } from "@/Store/hooks";
import { fetchWorkspaceMambersAction } from "@/Store/actions/workspace.action";
import { SuccessToast } from "../Toast/SuccessToast";
import { ErrorToast } from "../Toast/ErrorToast";

const options = [
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "Member",
    value: "MEMBER",
  },
];

const MembersTabContent = ({ workspaceMembers, currentUser }: any) => {
  const dispatch = useAppDispatch();
  const [userModal, setUserModal] = useState(false);
  const params = useParams();

  const handleRoleChange = async (
    workspaceId: string,
    userId: string,
    role: any,
  ) => {
    const payload = { workspaceId, userId, role };

    const res = await dispatch(changRoleAction(payload)).unwrap();

    if (res?.success) {
      await dispatch(fetchWorkspaceMambersAction(workspaceId));
      toast.custom((t) => (
        <SuccessToast t={t} title="Success" description={res.message} />
      ));
    } else {
      toast.custom((t) => (
        <ErrorToast t={t} title="Oops!" description="Something went wrong." />
      ));
    }
  };

  const handleRemoveUser = async (workspaceId: string, userId: string) => {
    try {
      const payload = {
        workspaceId,
        userId,
      };
      const res = await dispatch(removeUsersAction(payload)).unwrap();
      if (res?.success) {
        await dispatch(fetchWorkspaceMambersAction(workspaceId));
        toast.custom((t) => (
          <SuccessToast t={t} title="Success" description={res.message} />
        ));
      }
    } catch (err: any) {
      toast.custom((t) => (
        <ErrorToast t={t} title="Error" description={err?.message} />
      ));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Users size={16} className="text-brand" />
            </div>

            <h2 className="text-base font-semibold text-primary">
              Workspace members
            </h2>
          </div>

          <p className="mt-1.5 text-sm text-secondary">
            Manage workspace access and member roles.
          </p>
        </div>

        <Modal
          buttonVariant="soft"
          iconAnimate="scale"
          modalWidth="600px"
          buttonInnerText={
            <span className="flex items-center justify-center gap-2">
              <UserPlus size={15} strokeWidth={2} />
              <span>Invite member</span>
            </span>
          }
          open={userModal}
          setOpen={() => setUserModal((prev) => !prev)}
          title="Invite New Member"
          body={<InviteMemberForm setModal={setUserModal} />}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary">
            <tr>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                Member
              </th>

              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                Email
              </th>

              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                Role
              </th>

              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {workspaceMembers?.map((member: any) => {
              const user = member?.user;

              const userName =
                user?.name ||
                `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

              const isCurrentUser = user?.id === currentUser;

              return (
                <tr
                  key={user?.id}
                  className="transition-colors duration-150 hover:bg-accent"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0 rounded-full border border-border bg-secondary">
                        <AvatarImage
                          src={user?.image}
                          className="rounded-full object-cover"
                        />

                        <AvatarFallback className="flex h-full items-center justify-center rounded-full bg-secondary text-xs font-medium text-primary">
                          {nameInitials(user)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-primary">
                            {userName}
                          </span>

                          {isCurrentUser && (
                            <span className="rounded-md border border-brand/25 bg-brand/5 px-1.5 py-0.5 text-[10px] font-medium text-brand">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-secondary">
                      {user?.email}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="w-32">
                      <Select
                        options={options}

                        onChange={(val: any) => {
                          handleRoleChange(
                            member?.workspaceId,
                            user?.id,
                            val?.value,
                          );
                        }}
                        value={options.find(
                          (val: any) => val?.value === member?.role,
                        )}
                        getOptionValue={(val: any) => val.value}
                        getOptionLabel={(val: any) => val.label}
                        placeholder="Change role"
                        styles={commonSelectStyles2}
                        menuPortalTarget={document?.body}
                        isDisabled={isCurrentUser}
                        isClearable={false}
                      />
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {isCurrentUser ? (
                      <button
                        disabled
                        className="
                          flex items-center gap-2
                          rounded-lg
                          border border-border
                          bg-secondary
                          px-3 py-2
                          text-xs font-medium
                          text-secondary
                          opacity-70
                          cursor-not-allowed
                        "
                      >
                        <UserMinus size={14} />
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveUser(member?.workspaceId, user?.id)
                        }
                        className="
                          group
                          flex items-center gap-2
                          rounded-lg
                          border border-destructive/25
                          bg-destructive/5
                          px-3 py-2
                          text-xs font-medium
                          text-destructive
                          transition-colors duration-150
                          hover:border-destructive/40
                          hover:bg-destructive/10
                          cursor-pointer
                          focus-ring
                        "
                      >
                        <UserMinus
                          size={14}
                          className="transition-transform duration-150 group-hover:scale-105"
                        />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border" />

      <div className="max-w-2xl">
        <div>
          <h3 className="text-sm font-semibold text-primary">
            Members deletion settings
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Once you delete a member, they lose all access immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembersTabContent;
