"use client";

import { Trash2 } from "lucide-react";

const DangerContentTab = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-5 rounded-xl border border-destructive/30 bg-card p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <Trash2 className="text-destructive" size={16} />
          </div>

          <h2 className="text-base font-semibold text-destructive">
            Danger Zone
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl flex-1">
            <h4 className="mb-1 text-sm font-semibold text-primary">
              Delete this workspace
            </h4>

            <p className="text-sm leading-relaxed text-secondary">
              Once you delete a workspace, there is no going back. Data will be
              permanently scheduled for deletion in 30 days. You will not lose
              your member billing profile.
            </p>
          </div>

          <button className="focus-ring shrink-0 rounded-lg border border-destructive bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 cursor-pointer">
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerContentTab;
