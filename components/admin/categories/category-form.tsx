"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ApiService, { Category } from "@/lib/api";

interface CategoryFormProps {
  id?: string;
}

export function CategoryForm({ id }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch all categories for parent selection
    const fetchCategories = async () => {
      try {
        const data = await ApiService.getCategories();
        setCategories(data.filter((cat) => cat.id !== id)); // Exclude current category
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();

    // Fetch category data if editing
    if (isEditMode && id) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const category = await ApiService.getCategory(id);
          setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            parentId: category.parentId || "",
          });
        } catch (error) {
          console.error("Failed to fetch category:", error);
          toast({
            title: "Error",
            description: "Failed to load category data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [isEditMode, id]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        parentId: formData.parentId || undefined,
      };

      if (isEditMode && id) {
        await ApiService.updateCategory(id, payload);
        toast({
          title: "Success",
          description: "Category updated successfully.",
        });
      } else {
        await ApiService.createCategory(payload);
        toast({
          title: "Success",
          description: "Category created successfully.",
        });
      }
      router.push("/admin/categories");
    } catch (error: any) {
      console.error("Failed to save category:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/admin/categories");
  };

  if (loading && isEditMode) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading category data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Category" : "Add New Category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter category name"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="category-slug"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from name. Can be edited manually.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter category description"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <Select
              value={formData.parentId || "none"}
              onValueChange={(value) =>
                setFormData({ ...formData, parentId: value === "none" ? "" : value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Root Category)</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty to create a root category.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Category"
                : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
