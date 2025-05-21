"use client";

import { TableCell } from "@/components/ui/table";

import { TableBody } from "@/components/ui/table";

import { TableHead } from "@/components/ui/table";

import { TableRow } from "@/components/ui/table";

import { TableHeader } from "@/components/ui/table";

import { Table } from "@/components/ui/table";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash, Upload, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock product data for edit mode
const mockProduct = {
  id: "PROD-001",
  name: "Classic White Tee",
  slug: "classic-white-tee",
  description:
    "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear.",
  basePrice: "29.99",
  salePrice: "",
  onSale: false,
  featured: true,
  category: "t-shirts",
  tags: ["casual", "basics", "summer"],
  images: [
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ],
  variants: [
    {
      id: "var-1",
      color: "White",
      size: "S",
      sku: "WT-S-001",
      stock: 25,
      price: "29.99",
    },
    {
      id: "var-2",
      color: "White",
      size: "M",
      sku: "WT-M-001",
      stock: 40,
      price: "29.99",
    },
    {
      id: "var-3",
      color: "White",
      size: "L",
      sku: "WT-L-001",
      stock: 35,
      price: "29.99",
    },
    {
      id: "var-4",
      color: "White",
      size: "XL",
      sku: "WT-XL-001",
      stock: 20,
      price: "29.99",
    },
  ],
  attributes: [
    { name: "Material", value: "100% Organic Cotton" },
    { name: "Care", value: "Machine wash cold, tumble dry low" },
    { name: "Fit", value: "Regular fit" },
  ],
};

interface ProductFormProps {
  id?: string;
}

interface ProductVariant {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  price: string;
}

interface ProductAttribute {
  name: string;
  value: string;
}

export function ProductForm({ id }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    salePrice: "",
    onSale: false,
    featured: false,
    category: "",
    tags: [] as string[],
    images: [] as string[],
    variants: [] as ProductVariant[],
    attributes: [] as ProductAttribute[],
  });

  // New variant state
  const [newVariant, setNewVariant] = useState({
    color: "",
    size: "",
    sku: "",
    stock: "",
    price: "",
  });

  // New attribute state
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    value: "",
  });

  // New tag state
  const [newTag, setNewTag] = useState("");

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch the product data from the API
      setFormData(mockProduct);
    }
  }, [isEditMode]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new variant
  const addVariant = () => {
    if (
      !newVariant.color ||
      !newVariant.size ||
      !newVariant.sku ||
      !newVariant.stock ||
      !newVariant.price
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all variant fields",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `var-${Date.now()}`,
          ...newVariant,
          stock: Number.parseInt(newVariant.stock),
        },
      ],
    }));

    setNewVariant({
      color: "",
      size: "",
      sku: "",
      stock: "",
      price: "",
    });
  };

  // Remove a variant
  const removeVariant = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== id),
    }));
  };

  // Add a new attribute
  const addAttribute = () => {
    if (!newAttribute.name || !newAttribute.value) {
      toast({
        title: "Missing fields",
        description: "Please fill in both attribute name and value",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { ...newAttribute }],
    }));

    setNewAttribute({
      name: "",
      value: "",
    });
  };

  // Remove an attribute
  const removeAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  // Add a new tag
  const addTag = () => {
    if (!newTag) return;
    if (formData.tags.includes(newTag)) {
      toast({
        title: "Duplicate tag",
        description: "This tag already exists",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
    setNewTag("");
  };

  // Remove a tag
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Add a new image
  const addImage = () => {
    // In a real app, this would upload the image to a storage service
    // For this demo, we'll just add a placeholder
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, "/placeholder.svg?height=200&width=200"],
    }));
  };

  // Remove an image
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name ||
      !formData.description ||
      !formData.basePrice ||
      !formData.category
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send the data to an API
    console.log("Submitting product data:", formData);

    toast({
      title: isEditMode ? "Product updated" : "Product created",
      description: isEditMode
        ? "The product has been updated successfully"
        : "The product has been created successfully",
    });

    // Redirect to products list
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated-if-empty"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">
                    Base Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="basePrice"
                      name="basePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      className="pl-7"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t-shirts">T-Shirts</SelectItem>
                      <SelectItem value="pants">Pants</SelectItem>
                      <SelectItem value="dresses">Dresses</SelectItem>
                      <SelectItem value="outerwear">Outerwear</SelectItem>
                      <SelectItem value="sweaters">Sweaters</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center rounded-full bg-muted px-3 py-1 text-sm"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-4 w-4 rounded-full"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove tag</span>
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTag}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="onSale"
                    checked={formData.onSale}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("onSale", checked)
                    }
                  />
                  <Label htmlFor="onSale">On Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("featured", checked)
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-40 w-40 overflow-hidden rounded-md border"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <Trash className="h-3 w-3" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="flex h-40 w-40 flex-col items-center justify-center rounded-md border border-dashed"
                    onClick={addImage}
                  >
                    <Upload className="mb-2 h-6 w-6" />
                    <span>Upload Image</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload product images. The first image will be used as the
                  product thumbnail.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-5">
                  <div className="space-y-2">
                    <Label htmlFor="variantColor">Color</Label>
                    <Input
                      id="variantColor"
                      value={newVariant.color}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, color: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantSize">Size</Label>
                    <Input
                      id="variantSize"
                      value={newVariant.size}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, size: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantSku">SKU</Label>
                    <Input
                      id="variantSku"
                      value={newVariant.sku}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, sku: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantStock">Stock</Label>
                    <Input
                      id="variantStock"
                      type="number"
                      min="0"
                      value={newVariant.stock}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, stock: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variantPrice">Price</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="variantPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newVariant.price}
                        onChange={(e) =>
                          setNewVariant({
                            ...newVariant,
                            price: e.target.value,
                          })
                        }
                        className="pl-7"
                      />
                    </div>
                  </div>
                </div>
                <Button type="button" onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>

                {formData.variants.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-medium">
                      Product Variants
                    </h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Color</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.variants.map((variant) => (
                            <TableRow key={variant.id}>
                              <TableCell>{variant.color}</TableCell>
                              <TableCell>{variant.size}</TableCell>
                              <TableCell>{variant.sku}</TableCell>
                              <TableCell>{variant.stock}</TableCell>
                              <TableCell>${variant.price}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeVariant(variant.id)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">
                                    Remove variant
                                  </span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attributes" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="attributeName">Attribute Name</Label>
                    <Input
                      id="attributeName"
                      value={newAttribute.name}
                      onChange={(e) =>
                        setNewAttribute({
                          ...newAttribute,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g., Material, Care, Fit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attributeValue">Attribute Value</Label>
                    <Input
                      id="attributeValue"
                      value={newAttribute.value}
                      onChange={(e) =>
                        setNewAttribute({
                          ...newAttribute,
                          value: e.target.value,
                        })
                      }
                      placeholder="e.g., Cotton, Machine wash, Regular"
                    />
                  </div>
                </div>
                <Button type="button" onClick={addAttribute}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Attribute
                </Button>

                {formData.attributes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-medium">
                      Product Attributes
                    </h3>
                    <div className="space-y-4">
                      {formData.attributes.map((attr, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div>
                            <p className="font-medium">{attr.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {attr.value}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAttribute(index)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Remove attribute</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
