import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] active:translate-y-0 cursor-pointer",

        secondary:
          "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--secondary)] hover:border-[var(--ring)] cursor-pointer",

        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--secondary)] cursor-pointer",

        ghost:
          "bg-transparent text-[var(--foreground)] hover:bg-[var(--secondary)] cursor-pointer",

        destructive:
          "bg-destructive text-white hover:bg-destructive/90 cursor-pointer",

        delete:
          "border border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600 active:bg-red-700 active:border-red-700 cursor-pointer",

        soft: "border border-default bg-card text-primary shrink-0 gap-1.5 hover:border-brand hover:bg-accent hover:text-brand active:scale-[0.98] cursor-pointer",
      },

      size: {
        default: "h-10 px-4 py-[24px]",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-6",
        icon: "size-9",
        toolbar: "px-3 py-4 text-xs",
      },

      iconAnimation: {
        none: "",
        spin: "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:rotate-90",
        flip: "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:rotate-180",
        tilt: "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:-rotate-12",
        scale:
          "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:scale-117",
        "spin-ccw":
          "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:-rotate-180",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      iconAnimation: "none",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  iconAnimation = "none",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, size, iconAnimation, className }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
