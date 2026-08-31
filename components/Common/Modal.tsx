"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface ModalTypes {
  open: boolean;
  setOpen: (open: boolean) => void;
  buttonInnerText: React.ReactNode;
  buttonClassName?: string;
  title: string;
  body: React.ReactNode;
  buttonVariant?:
    "default" | "secondary" | "outline" | "ghost" | "destructive" | "soft";
  buttonSize?: "lg" | "default" | "sm" | "icon";
  subHeading?: string;
  modalWidth?: string;
  iconAnimate?: "none" | "spin" | "tilt" | "flip" | "scale" | "spin-ccw";
}

export function Modal({
  open,
  setOpen,
  buttonInnerText,
  buttonClassName = "",
  title,
  body,
  buttonSize,
  buttonVariant = "default",
  subHeading,
  modalWidth = "670px",
  iconAnimate = "none",
}: ModalTypes) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={buttonClassName}
          variant={buttonVariant}
          size={buttonSize}
          iconAnimation={iconAnimate}
        >
          {buttonInnerText}
        </Button>
      </DialogTrigger>

      <DialogContent
        style={{ maxWidth: modalWidth }}
        className="border-default bg-card text-primary shadow-card max-h-[95vh] flex flex-col"
      >
        <DialogHeader className="gap-0.5 px-2">
          <DialogTitle className="text-lg font-semibold tracking-tight text-primary">
            {title}
          </DialogTitle>
          <p className="text-sm leading-5 mb-2 text-secondary">{subHeading}</p>
        </DialogHeader>

        <div className="py-2 overflow-y-auto px-2">{body}</div>
      </DialogContent>
    </Dialog>
  );
}
