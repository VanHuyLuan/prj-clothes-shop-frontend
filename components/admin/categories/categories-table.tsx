"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Category } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CategoryViewDialog } from "./category-view-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";

interface CategoriesTableProps {
  categories: Category[];
  loading?: boolean;
  onDelete?: (categoryId: string) => void;
}

export function CategoriesTable({
  categories,
  loading = false,
  onDelete,
}: CategoriesTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleView = (category: Category) => {
    setViewCategory(category);
  };

  const handleEdit = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}`);
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    
    setDeleting(true);
    try {
      await onDelete?.(deleteCategory.id);
      setDeleteCategory(null);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{category.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate text-muted-foreground">
                  {category.description || "—"}
                </div>
              </TableCell>
              <TableCell>
                {category.parent ? (
                  <Badge variant="outline">{category.parent.name}</Badge>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    Root Category
                  </span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(category.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(category)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(category.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteCategory(category)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {viewCategory && (
        <CategoryViewDialog
          key={`view-${viewCategory.id}`}
          category={viewCategory}
          open={true}
          onOpenChange={(open) => { if (!open) setViewCategory(null); }}
        />
      )}

      {deleteCategory && (
        <CategoryDeleteDialog
          key={`delete-${deleteCategory.id}`}
          category={deleteCategory}
          open={true}
          onOpenChange={(open) => { if (!open) setDeleteCategory(null); }}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}
