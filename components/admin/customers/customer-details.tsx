"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Edit, Ban } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  joinDate: string
  lastOrderDate: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive" | "banned"
  loyaltyPoints: number
}

interface CustomerDetailsProps {
  customer: Customer
  onEdit: () => void
  onBan: () => void
}

export function CustomerDetails({ customer, onEdit, onBan }: CustomerDetailsProps) {
  const mockCustomer: Customer = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=80&width=80",
    address: {
      street: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    joinDate: "2023-03-15",
    lastOrderDate: "2024-01-20",
    totalOrders: 12,
    totalSpent: 1250.0,
    status: "active",
    loyaltyPoints: 450,
  }

  const displayCustomer = customer || mockCustomer

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "banned":
        return <Badge variant="destructive">Banned</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={displayCustomer.avatar || "/placeholder.svg"} alt={displayCustomer.name} />
                <AvatarFallback className="text-lg">
                  {displayCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{displayCustomer.name}</h2>
                <p className="text-muted-foreground">Customer ID: {displayCustomer.id}</p>
                {getStatusBadge(displayCustomer.status)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={onBan} variant="destructive">
                <Ban className="mr-2 h-4 w-4" />
                Ban Customer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{displayCustomer.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{displayCustomer.phone}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <div>{displayCustomer.address.street}</div>
                <div>
                  {displayCustomer.address.city}, {displayCustomer.address.state} {displayCustomer.address.zipCode}
                </div>
                <div>{displayCustomer.address.country}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Member Since</span>
              </div>
              <span>{new Date(displayCustomer.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Order</span>
              <span>{new Date(displayCustomer.lastOrderDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Loyalty Points</span>
              <Badge variant="outline">{displayCustomer.loyaltyPoints} points</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{displayCustomer.totalOrders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">${displayCustomer.totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">
                ${(displayCustomer.totalSpent / displayCustomer.totalOrders).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Average Order Value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
