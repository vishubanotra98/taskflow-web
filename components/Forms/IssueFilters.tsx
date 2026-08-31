"use client";

import { useState } from "react";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import Select from "react-select";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { commonSelectStyles2 } from "@/utils/styles";
import {
  AssigneeControl,
  CustomOption,
  CustomSingleValue,
  PriorityPlaceholder,
  StatusPlaceholder,
} from "../ui/Common";

interface IssueFiltersProps {
  members: any[];
  statusList: any[];
  priorityList: any[];
  issuesLoading: boolean;

  filters: {
    startDate: Date | null;
    endDate: Date | null;
    assignee: string | null;
    status: string | null;
    priority: string | null;
  };

  onApply: (filters: IssueFiltersProps["filters"]) => void;
}

export function IssueFilters({
  members,
  statusList,
  priorityList,
  filters,
  issuesLoading,
  onApply,
}: IssueFiltersProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const updateFilter = (key: keyof typeof localFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      startDate: null,
      endDate: null,
      assignee: null,
      status: null,
      priority: null,
    };

    setLocalFilters(clearedFilters);
    onApply(clearedFilters);
    setOpen(false);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const memberList = members?.map((mem: any) => {
    const name =
      mem?.user?.name ||
      [mem?.user?.firstName, mem?.user?.lastName].filter(Boolean).join(" ");

    return {
      userId: mem?.user?.id,
      role: mem?.role,
      name,
      email: mem?.user?.email,
    };
  });

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) {
          setLocalFilters(filters);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="soft"
          iconAnimation="scale"
          className={cn(open && "border-brand ring-[rgba(20,184,166,0.12)]")}
        >
          <Filter size={16} />

          <span>Filters</span>

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] rounded-xl border border-default bg-card p-0 shadow-card"
      >
        <div className="flex items-center justify-between border-b border-default px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-primary">
              Filter issues
            </h3>

            <p className="mt-0.5 text-xs text-secondary">
              Narrow down the issues on this board
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-secondary hover:text-primary"
            onClick={() => setOpen(false)}
          >
            <X size={16} />
          </Button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <label className="text-sm font-medium text-primary">
              Target date
            </label>

            <div className="mt-1.5 grid grid-cols-2 gap-3">
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 w-full justify-start font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />

                    {localFilters.startDate ? (
                      <span>
                        {format(localFilters.startDate, "dd MMM yyyy")}
                      </span>
                    ) : (
                      <span className="text-secondary">From</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-auto rounded-lg border border-default bg-card p-3 shadow-card"
                >
                  <Calendar
                    mode="single"
                    selected={localFilters.startDate ?? undefined}
                    onSelect={(date) => {
                      updateFilter("startDate", date ?? null);

                      if (date) {
                        setStartDateOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      localFilters.endDate ? date > localFilters.endDate : false
                    }
                    captionLayout="label"
                  />

                  {localFilters.startDate && (
                    <div className="mt-3 border-t border-default pt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          updateFilter("startDate", null);
                          setStartDateOpen(false);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 w-full justify-start font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />

                    {localFilters.endDate ? (
                      <span>{format(localFilters.endDate, "dd MMM yyyy")}</span>
                    ) : (
                      <span className="text-secondary">To</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-auto rounded-lg border border-default bg-card p-3 shadow-card"
                >
                  <Calendar
                    mode="single"
                    selected={localFilters.endDate ?? undefined}
                    onSelect={(date) => {
                      updateFilter("endDate", date ?? null);

                      if (date) {
                        setEndDateOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      localFilters.startDate
                        ? date < localFilters.startDate
                        : false
                    }
                    captionLayout="label"
                  />

                  {localFilters.endDate && (
                    <div className="mt-3 border-t border-default pt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          updateFilter("endDate", null);
                          setEndDateOpen(false);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-primary">Assignee</label>

            <Select
              className="mt-1.5"
              options={memberList}
              value={
                memberList?.find(
                  (member: any) => member.userId === localFilters.assignee,
                ) || null
              }
              onChange={(value: any) =>
                updateFilter("assignee", value?.userId ?? null)
              }
              getOptionValue={(value: any) => value.userId}
              getOptionLabel={(value: any) => value.name}
              placeholder="All assignees"
              isClearable
              isSearchable={false}
              styles={commonSelectStyles2}
              components={{ Control: AssigneeControl }}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary">Status</label>

            <Select
              className="mt-1.5"
              options={statusList}
              value={
                statusList?.find(
                  (status: any) => status.id === localFilters.status,
                ) || null
              }
              onChange={(value: any) =>
                updateFilter("status", value?.id ?? null)
              }
              getOptionValue={(value: any) => value.id}
              getOptionLabel={(value: any) => value.name}
              placeholder="All statuses"
              isClearable
              isSearchable={false}
              styles={commonSelectStyles2}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
                Placeholder: StatusPlaceholder,
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary">Priority</label>

            <Select
              className="mt-1.5"
              options={priorityList}
              value={
                priorityList?.find(
                  (priority: any) => priority.value === localFilters.priority,
                ) || null
              }
              onChange={(value: any) =>
                updateFilter("priority", value?.value ?? null)
              }
              getOptionValue={(value: any) => value.value}
              getOptionLabel={(value: any) => value.label}
              placeholder="All priorities"
              isClearable
              isSearchable={false}
              styles={commonSelectStyles2}
              components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
                Placeholder: PriorityPlaceholder,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-default px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            disabled={activeFilterCount === 0}
          >
            Clear filters
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            className="bg-brand text-white hover:bg-brand/90"
          >
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
