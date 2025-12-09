"use client";

import { useState } from "react";
import { Category } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CategoryViewDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryViewDialog({
  category,
  open,
  onOpenChange,
}: CategoryViewDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
              <DialogTitle>Category Details</DialogTitle>
              <DialogDescription>
                View detailed information about this category
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl">
                {category.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded mt-1 inline-block">
                {category.slug}
              </code>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="mt-1 text-sm">
                {category.description || "No description"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Parent Category
              </label>
              <div className="mt-1">
                {category.parent ? (
                  <Badge variant="outline">{category.parent.name}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Root Category
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created At
                </label>
                <p className="mt-1 text-sm">
                  {new Date(category.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Updated At
                </label>
                <p className="mt-1 text-sm">
                  {new Date(category.updated_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Category ID
              </label>
              <code className="mt-1 block text-xs bg-muted px-2 py-1 rounded break-all">
                {category.id}
              </code>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
