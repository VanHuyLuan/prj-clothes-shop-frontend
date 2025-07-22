"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dữ liệu giả để hiển thị trong chế độ chỉnh sửa
const mockCategory = {
  id: "1",
  name: "Women's Clothing",
  description: "Fashion for women including dresses, tops, and more",
  image: "/placeholder.svg?height=40&width=40",
  isActive: true,
  parentId: "",
};

// Sửa lại interface để chấp nhận prop 'id'
interface CategoryFormProps {
  id?: string;
}

export function CategoryForm({ id }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    parentId: "",
  });

  useEffect(() => {
    if (isEditMode) {
      // Trong ứng dụng thật, bạn sẽ fetch dữ liệu từ API dựa trên id
      // Ở đây chúng ta dùng dữ liệu giả để minh họa
      console.log("Fetching data for category ID:", id);
      setFormData({
        name: mockCategory.name,
        description: mockCategory.description,
        image: mockCategory.image,
        isActive: mockCategory.isActive,
        parentId: mockCategory.parentId || "",
      });
    }
  }, [isEditMode, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    toast({
      title: `Category ${isEditMode ? "updated" : "created"}`,
      description: `The category has been ${
        isEditMode ? "updated" : "created"
      } successfully.`,
    });
    router.push("/admin/categories");
  };

  const onCancel = () => {
    router.push("/admin/categories");
  };

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
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              required
            />
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
            />
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Category"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">Active Category</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {isEditMode ? "Update Category" : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
