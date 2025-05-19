"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "border border-border",
        classNames: {
          toast: "group flex w-full items-center bg-background p-4 shadow",
          title: "text-sm font-medium",
          description: "text-sm opacity-90",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-muted hover:bg-muted/80",
          closeButton: "text-foreground/50 hover:text-foreground",
        },
      }}
    />
  );
}
