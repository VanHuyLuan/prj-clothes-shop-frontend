"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash, Upload, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApiService, { 
  type Product, 
  type Category,
  type CreateProductDto,
  type UpdateProductDto
} from "@/lib/api";

interface ProductFormProps {
  id?: string;
}

interface ProductVariantForm {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price: string;
  sale_price: string;
  stock_qty: string;
}

interface ProductImageForm {
  id?: string;
  url: string;
  alt_text: string;
  sort: number;
}

export function ProductForm({ id }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    status: "active" as "active" | "inactive",
    categoryIds: [] as string[],
  });

  const [variants, setVariants] = useState<ProductVariantForm[]>([]);
  const [images, setImages] = useState<ProductImageForm[]>([]);
  const [uploading, setUploading] = useState(false);

  // New variant state
  const [newVariant, setNewVariant] = useState<ProductVariantForm>({
    size: "",
    color: "",
    sku: "",
    price: "",
    sale_price: "",
    stock_qty: "",
  });

  // New image state
  const [newImage, setNewImage] = useState({
    url: "",
    alt_text: "",
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await ApiService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    loadCategories();
  }, []);

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const product = await ApiService.getProduct(id);
          
          setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            brand: product.brand || "",
            status: product.status as "active" | "inactive",
            categoryIds: product.categories?.map(c => c.id) || [],
          });

          if (product.variants) {
            setVariants(product.variants.map(v => ({
              id: v.id,
              size: v.size || "",
              color: v.color || "",
              sku: v.sku,
              price: typeof v.price === 'number' ? v.price.toString() : v.price,
              sale_price: v.sale_price ? (typeof v.sale_price === 'number' ? v.sale_price.toString() : v.sale_price) : "",
              stock_qty: v.stock_qty.toString(),
            })));
          }

          if (product.images) {
            setImages(product.images.map(img => ({
              id: img.id,
              url: img.url,
              alt_text: img.alt_text || "",
              sort: img.sort,
            })));
          }
        } catch (error) {
          console.error("Failed to load product:", error);
          toast({
            title: "Error",
            description: "Failed to load product data",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [isEditMode, id]);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug when name changes
      if (name === "name" && !isEditMode) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  // Add a new variant
  const addVariant = () => {
    if (
      !newVariant.sku ||
      !newVariant.price ||
      !newVariant.stock_qty
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in SKU, price, and stock quantity",
        variant: "destructive",
      });
      return;
    }

    setVariants((prev) => [...prev, { ...newVariant }]);
    setNewVariant({
      size: "",
      color: "",
      sku: "",
      price: "",
      sale_price: "",
      stock_qty: "",
    });
  };

  // Remove a variant
  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, or WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const result = await ApiService.uploadImage(file, 'products');
      
      setImages((prev) => [
        ...prev,
        {
          url: result.url,
          alt_text: newImage.alt_text || formData.name,
          sort: prev.length,
        },
      ]);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      setNewImage({
        url: "",
        alt_text: "",
      });

      // Reset file input
      e.target.value = '';
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Add a new image (manual URL)
  const addImage = () => {
    if (!newImage.url) {
      toast({
        title: "Missing URL",
        description: "Please enter an image URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    setImages((prev) => [
      ...prev,
      {
        ...newImage,
        sort: prev.length,
      },
    ]);
    setNewImage({
      url: "",
      alt_text: "",
    });
  };

  // Remove an image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Move image up/down
  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [
        newImages[targetIndex],
        newImages[index],
      ];
      // Update sort values
      newImages.forEach((img, i) => {
        img.sort = i;
      });
      setImages(newImages);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== FORM SUBMIT START ===");
    console.log("Form Data:", formData);
    console.log("Variants:", variants);
    console.log("Images:", images);

    // Validate form
    if (!formData.name || !formData.description) {
      const errorMsg = `Missing: ${!formData.name ? 'Name' : ''} ${!formData.description ? 'Description' : ''}`;
      console.error("Validation failed:", errorMsg);
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${errorMsg}`,
        variant: "destructive",
      });
      return;
    }

    if (variants.length === 0) {
      console.error("Validation failed: No variants");
      toast({
        title: "⚠️ No variants added",
        description: "Please fill in variant details (SKU, Price, Stock) and click 'Add Variant' button in the Variants tab!",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare data according to API specification
      const baseData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        brand: formData.brand || undefined,
        status: formData.status,
        categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
        variants: variants.map((v) => ({
          size: v.size || undefined,
          color: v.color || undefined,
          sku: v.sku,
          price: parseFloat(v.price), // Convert to number
          sale_price: v.sale_price ? parseFloat(v.sale_price) : undefined, // Convert to number
          stock_qty: parseInt(v.stock_qty),
        })),
        images: images.length > 0 ? images.map((img) => ({
          url: img.url,
          alt_text: img.alt_text || undefined,
          sort: img.sort,
        })) : undefined,
      };

      console.log("Prepared Data:", baseData);

      if (isEditMode && id) {
        console.log("Updating product...", id);
        const updateData: UpdateProductDto = baseData;
        await ApiService.updateProduct(id, updateData);
        toast({
          title: "Product updated",
          description: "The product has been updated successfully",
        });
      } else {
        console.log("Creating new product...");
        const createData: CreateProductDto = {
          ...baseData,
          variants: baseData.variants, // Required for create
        };
        console.log("Create Data:", createData);
        await ApiService.createProduct(createData);
        toast({
          title: "Product created",
          description: "The product has been created successfully",
        });
      }

      console.log("=== FORM SUBMIT SUCCESS ===");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error("=== FORM SUBMIT ERROR ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      
      // Better error handling
      let errorMessage = "Failed to save product. Check console for details.";
      let errorDetails = "";
      
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message;
        errorDetails = JSON.stringify(error.response.data, null, 2);
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Detailed error:", errorDetails || error);

      toast({
        title: `Error ${isEditMode ? 'updating' : 'creating'} product`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log("=== FORM SUBMIT END ===");
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg">Loading product data...</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Classic White T-Shirt"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="classic-white-t-shirt"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from product name if left empty
                  </p>
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
                    placeholder="Detailed product description..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Nike, Adidas, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add different sizes, colors, and SKUs for this product
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Variants */}
              {variants.length > 0 && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.map((variant, index) => (
                        <TableRow key={index}>
                          <TableCell>{variant.size || "—"}</TableCell>
                          <TableCell>{variant.color || "—"}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {variant.sku}
                            </code>
                          </TableCell>
                          <TableCell>${variant.price}</TableCell>
                          <TableCell>
                            {variant.sale_price ? `$${variant.sale_price}` : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                parseInt(variant.stock_qty) > 50
                                  ? "default"
                                  : parseInt(variant.stock_qty) > 0
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {variant.stock_qty}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeVariant(index)}
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Add New Variant */}
              <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Add New Variant</h3>
                  {variants.length === 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                      ⚠️ At least 1 variant required
                    </Badge>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="variant-size">Size</Label>
                    <Input
                      id="variant-size"
                      value={newVariant.size}
                      onChange={(e) =>
                        setNewVariant((prev) => ({ ...prev, size: e.target.value }))
                      }
                      placeholder="S, M, L, XL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variant-color">Color</Label>
                    <Input
                      id="variant-color"
                      value={newVariant.color}
                      onChange={(e) =>
                        setNewVariant((prev) => ({ ...prev, color: e.target.value }))
                      }
                      placeholder="Red, Blue, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variant-sku">
                      SKU <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="variant-sku"
                      value={newVariant.sku}
                      onChange={(e) =>
                        setNewVariant((prev) => ({ ...prev, sku: e.target.value }))
                      }
                      placeholder="PROD-001-M"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variant-price">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="variant-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newVariant.price}
                      onChange={(e) =>
                        setNewVariant((prev) => ({ ...prev, price: e.target.value }))
                      }
                      placeholder="29.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variant-sale-price">Sale Price</Label>
                    <Input
                      id="variant-sale-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newVariant.sale_price}
                      onChange={(e) =>
                        setNewVariant((prev) => ({
                          ...prev,
                          sale_price: e.target.value,
                        }))
                      }
                      placeholder="24.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variant-stock">
                      Stock Qty <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="variant-stock"
                      type="number"
                      min="0"
                      value={newVariant.stock_qty}
                      onChange={(e) =>
                        setNewVariant((prev) => ({
                          ...prev,
                          stock_qty: e.target.value,
                        }))
                      }
                      placeholder="100"
                    />
                  </div>
                </div>
                <Button type="button" onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add images for your product. First image will be the main image.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Images */}
              {images.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg border p-3 space-y-2"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt_text || `Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {image.alt_text || "No alt text"}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                          className="flex-1"
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(index, "down")}
                          disabled={index === images.length - 1}
                          className="flex-1"
                        >
                          ↓
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-5 left-5">Main</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Image */}
              <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <h3 className="font-medium">Add New Image</h3>
                
                {/* Upload from file */}
                <div className="space-y-2">
                  <Label htmlFor="image-file">Upload Image File</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image-file"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading || loading}
                      className="flex-1"
                    />
                    {uploading && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="animate-pulse">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max 5MB. Accepts JPEG, PNG, GIF, WebP
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-muted/30 px-2 text-muted-foreground">
                      Or enter URL manually
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      value={newImage.url}
                      onChange={(e) =>
                        setNewImage((prev) => ({ ...prev, url: e.target.value }))
                      }
                      placeholder="https://example.com/image.jpg"
                      disabled={uploading || loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-alt">Alt Text (Optional)</Label>
                    <Input
                      id="image-alt"
                      value={newImage.alt_text}
                      onChange={(e) =>
                        setNewImage((prev) => ({ ...prev, alt_text: e.target.value }))
                      }
                      placeholder="Product image description"
                      disabled={uploading || loading}
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={addImage}
                  disabled={!newImage.url || uploading || loading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image from URL
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select one or more categories for this product
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                      formData.categoryIds.includes(category.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      {category.parent && (
                        <div className="text-xs text-muted-foreground">
                          {category.parent.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {categories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No categories available. Please create categories first.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Product"
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
