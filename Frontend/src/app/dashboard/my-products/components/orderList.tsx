"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS } from "@/type/base.type"

interface Order {
  _id: string
  product: {
    name: string
  }
  seller: {
    username: string
  }
  quantity: number
  totalPrice: number
  orderStatus: ORDER_STATUS
  createdAt: string
}

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/order", { withCredentials: true })
      setOrders(response.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-h-[400px] overflow-y-auto border rounded-lg shadow-md">
        <Table className="w-full">
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>{order.seller.username}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`bg-${getStatusColor(order.orderStatus)}-100 text-${getStatusColor(order.orderStatus)}-800`}
                  >
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function getStatusColor(status: ORDER_STATUS) {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "yellow"
    case ORDER_STATUS.PLACED:
      return "blue"
    case ORDER_STATUS.SHIPPED:
      return "purple"
    case ORDER_STATUS.DELIVERED:
      return "green"
    case ORDER_STATUS.CANCELLED:
      return "red"
    default:
      return "gray"
  }
}
