"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
    </Link>
  );
}
