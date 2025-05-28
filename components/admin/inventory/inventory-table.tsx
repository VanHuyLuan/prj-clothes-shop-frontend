"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Plus, Minus, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  image: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface InventoryTableProps {
  items?: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onUpdateStock?: (itemId: string, newStock: number) => void;
}

export function InventoryTable({
  items = [],
  onEdit = () => {},
  onUpdateStock = () => {},
}: InventoryTableProps) {
  const [stockUpdates, setStockUpdates] = useState<{ [key: string]: number }>(
    {}
  );

  const mockItems: InventoryItem[] = [
    {
      id: "1",
      productName: "Classic White T-Shirt",
      sku: "CWT-001",
      image: "/placeholder.svg?height=40&width=40",
      category: "T-Shirts",
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      price: 29.99,
      lastUpdated: "2024-01-20",
      status: "in-stock",
    },
    {
      id: "2",
      productName: "Denim Jacket",
      sku: "DJ-002",
      image: "/placeholder.svg?height=40&width=40",
      category: "Jackets",
      currentStock: 8,
      minStock: 10,
      maxStock: 50,
      price: 89.99,
      lastUpdated: "2024-01-19",
      status: "low-stock",
    },
    {
      id: "3",
      productName: "Summer Dress",
      sku: "SD-003",
      image: "/placeholder.svg?height=40&width=40",
      category: "Dresses",
      currentStock: 0,
      minStock: 5,
      maxStock: 30,
      price: 59.99,
      lastUpdated: "2024-01-18",
      status: "out-of-stock",
    },
    {
      id: "4",
      productName: "Running Shoes",
      sku: "RS-004",
      image: "/placeholder.svg?height=40&width=40",
      category: "Shoes",
      currentStock: 25,
      minStock: 15,
      maxStock: 75,
      price: 129.99,
      lastUpdated: "2024-01-20",
      status: "in-stock",
    },
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  const getStatusBadge = (
    status: string,
    currentStock: number,
    minStock: number
  ) => {
    if (currentStock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (currentStock <= minStock) {
      return <Badge variant="destructive">Low Stock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    let color = "bg-green-500";
    if (current <= min) color = "bg-red-500";
    else if (current <= min * 2) color = "bg-yellow-500";

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };

  const handleStockUpdate = (itemId: string, change: number) => {
    const item = displayItems.find((i) => i.id === itemId);
    if (!item) return;

    const currentValue = stockUpdates[itemId] ?? item.currentStock;
    const newValue = Math.max(0, currentValue + change);
    setStockUpdates({ ...stockUpdates, [itemId]: newValue });
  };

  const handleStockSave = (itemId: string) => {
    const newStock = stockUpdates[itemId];
    if (newStock !== undefined) {
      onUpdateStock(itemId, newStock);
      const { [itemId]: removed, ...rest } = stockUpdates;
      setStockUpdates(rest);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayItems.map((item) => {
            const currentStock = stockUpdates[item.id] ?? item.currentStock;
            const hasChanges = stockUpdates[item.id] !== undefined;

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                      />
                      <AvatarFallback>
                        {item.productName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        Updated{" "}
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {item.sku}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStockUpdate(item.id, -1)}
                      disabled={currentStock <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={currentStock}
                      onChange={(e) =>
                        setStockUpdates({
                          ...stockUpdates,
                          [item.id]: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 text-center"
                      min="0"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStockUpdate(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    {hasChanges && (
                      <Button
                        size="sm"
                        onClick={() => handleStockSave(item.id)}
                      >
                        Save
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Min: {item.minStock} | Max: {item.maxStock}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getStockLevel(currentStock, item.minStock, item.maxStock)}
                    <div className="text-xs text-muted-foreground">
                      {currentStock} / {item.maxStock}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">${item.price}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status, currentStock, item.minStock)}
                    {currentStock <= item.minStock && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
