"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "./search-dialog";
import { useSearchShortcut } from "@/hooks/use-search-shortcut";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  className?: string;
  variant?: "ghost" | "outline" | "default";
  isHomePage?: boolean;
  scrolled?: boolean;
}

export function SearchButton({ 
  className, 
  variant = "ghost",
  isHomePage = false,
  scrolled = false
}: SearchButtonProps) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  useSearchShortcut({ onOpen: () => setOpen(true) });

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant}
        size="icon"
        className={cn(
          "rounded-full relative group",
          isHomePage && !scrolled
            ? "hover:bg-white/10"
            : "text-foreground hover:bg-muted/80",
          className
        )}
        title={`Search (${isMac ? '⌘' : 'Ctrl'}+K)`}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </span>
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
