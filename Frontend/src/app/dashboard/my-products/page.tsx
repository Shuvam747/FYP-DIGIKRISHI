"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, LogOut } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Order, ORDER_STATUS, Products } from "@/type/base.type"
import { useToast } from "@/hooks/use-toast"
import ProductCard from "./components/productcard"
import OrderList from "./components/order"
export default function MyProducts() {
  const [products, setProducts] = useState<Products[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [sortStatus, setSortStatus] = useState<ORDER_STATUS | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const fetchMyProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get("http://localhost:4000/api/v1/product/my-product", { withCredentials: true })
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async (productId: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/order/${productId}`, {
        withCredentials: true,
      })
      setOrders(response.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async (productId: string, updatedData: Partial<Products>) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/product/${productId}`, updatedData, { withCredentials: true })
      toast({
        title: "Success",
        description: "Product updated successfully.",
      })
      fetchMyProducts()
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProductImage = async (productId: string, imageFile: File) => {
    try {
      const formData = new FormData()
      formData.append("image", imageFile)
      await axios.put(`http://localhost:4000/api/v1/product/image/${productId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast({
        title: "Success",
        description: "Product image updated successfully.",
      })
      fetchMyProducts()
    } catch (error) {
      console.error("Error updating product image:", error)
      toast({
        title: "Error",
        description: "Failed to update product image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: ORDER_STATUS) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/order/${orderId}`, { status: newStatus }, { withCredentials: true })
      toast({
        title: "Success",
        description: "Order status updated successfully.",
      })
      if (selectedProduct) {
        fetchOrders(selectedProduct._id)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await axios.put("http://localhost:4000/api/v1/auth/logout", {}, { withCredentials: true })
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sortOrders = (status: ORDER_STATUS) => {
    const newSortOrder = status === sortStatus && sortOrder === "asc" ? "desc" : "asc"
    setSortStatus(status)
    setSortOrder(newSortOrder)

    const sortedOrders = [...orders].sort((a, b) => {
      if (a.orderStatus === status && b.orderStatus !== status) return -1
      if (a.orderStatus !== status && b.orderStatus === status) return 1
      return newSortOrder === "asc"
        ? a.orderStatus.localeCompare(b.orderStatus)
        : b.orderStatus.localeCompare(a.orderStatus)
    })

    setOrders(sortedOrders)
  }

  const handleViewOrders = (product: Products) => {
    setSelectedProduct(product)
    fetchOrders(product._id)
    setIsOrderDialogOpen(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <div className="flex space-x-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        {products.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Products</AlertTitle>
            <AlertDescription>You don't have any products yet.</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewOrders={() => handleViewOrders(product)}
                onEditProduct={(updatedData) => handleEditProduct(product._id, updatedData)}
                onEditProductImage={(imageFile) => handleEditProductImage(product._id, imageFile)}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">Orders for {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <OrderList
            orders={orders}
            sortStatus={sortStatus}
            sortOrder={sortOrder}
            onSortOrders={sortOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}