import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Order, ORDER_STATUS } from "@/type/base.type"
import { ArrowUpDown } from "lucide-react"

interface OrderListProps {
  orders: Order[]
  sortStatus: ORDER_STATUS | null
  sortOrder: "asc" | "desc"
  onSortOrders: (status: ORDER_STATUS) => void
  onUpdateOrderStatus: (orderId: string, newStatus: ORDER_STATUS) => void
}

const getStatusColor = (status: ORDER_STATUS) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "bg-yellow-500 hover:bg-yellow-600"
    case ORDER_STATUS.PLACED:
      return "bg-blue-500 hover:bg-blue-600"
    case ORDER_STATUS.SHIPPED:
      return "bg-purple-500 hover:bg-purple-600"
    case ORDER_STATUS.DELIVERED:
      return "bg-green-500 hover:bg-green-600"
    case ORDER_STATUS.CANCELLED:
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

export default function OrderList({
  orders,
  sortStatus,
  sortOrder,
  onSortOrders,
  onUpdateOrderStatus,
}: OrderListProps) {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-lg font-medium mb-2 md:mb-0">Order List</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(ORDER_STATUS).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={sortStatus === status ? "default" : "outline"}
              className={`${getStatusColor(status)} text-white`}
              onClick={() => onSortOrders(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {sortStatus === status && (
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
              )}
            </Button>
          ))}
        </div>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        {orders.length > 0 ? (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="bg-white p-3 rounded-lg shadow">
                <p className="font-medium">Order ID: {order._id}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">Buyer: {order.buyer.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.values(ORDER_STATUS).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      className={`${getStatusColor(status)} text-white ${
                        order.orderStatus === status ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                      onClick={() => onUpdateOrderStatus(order._id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No orders found for this product.</p>
        )}
      </ScrollArea>
    </>
  )
}


