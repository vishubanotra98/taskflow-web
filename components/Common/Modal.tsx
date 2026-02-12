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
  setOpen: () => void;
  buttonInnerText: React.ReactNode;
  buttonClassName: string;
  title: string;
  body: React.ReactNode;
}

export function Modal({
  open,
  setOpen,
  buttonInnerText,
  buttonClassName,
  title,
  body,
}: ModalTypes) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`button-primary ${buttonClassName}`}>
          {buttonInnerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1f2937] text-white border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div>{body}</div>
      </DialogContent>
    </Dialog>
  );
}
