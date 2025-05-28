"use client";

// import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

interface CategoriesTableProps {
  categories?: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
  onView?: (category: Category) => void;
}

export function CategoriesTable({
  categories = [],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
}: CategoriesTableProps) {
  //   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Women's Clothing",
      description: "Fashion for women including dresses, tops, and more",
      image: "/placeholder.svg?height=40&width=40",
      isActive: true,
      productCount: 156,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Men's Clothing",
      description: "Stylish clothing for men",
      image: "/placeholder.svg?height=40&width=40",
      isActive: true,
      productCount: 89,
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Accessories",
      description: "Bags, jewelry, and fashion accessories",
      image: "/placeholder.svg?height=40&width=40",
      isActive: false,
      productCount: 45,
      createdAt: "2024-01-05",
    },
    {
      id: "4",
      name: "Kids",
      description: "Clothing for children and babies",
      image: "/placeholder.svg?height=40&width=40",
      isActive: true,
      productCount: 67,
      createdAt: "2024-01-01",
    },
  ];

  const displayCategories = categories.length > 0 ? categories : mockCategories;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                    />
                    <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{category.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate text-muted-foreground">
                  {category.description}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {category.productCount} products
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(category.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(category)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(category)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(category.id)}
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
    </div>
  );
}
