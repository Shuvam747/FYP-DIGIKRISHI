"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { User, LogOut, Mail, Award, CheckCircle, XCircle, Shield, Camera, ShoppingBag, Book, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { AddProductForm } from "./component/addproductform"
import { ProductSlider } from "./component/productslider"
import { VerificationPopup } from "./component/verificationpopup"
import { ChangeProfilePictureModal } from "./component/changeProfilePic"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OrderList } from "./my-products/components/orderList"
import { ResourceList } from "./component/resource"
import { AddResourceForm } from "./component/addresource"


interface UserData {
  _id: string
  username: string
  email: string
  role: string
  isVerified: boolean
  emailVerified: boolean
  numberVerified: boolean
  points: number
  twoFactorEnabled: boolean
  profilePicture?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false)
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false)
  const [isAddProductFormVisible, setIsAddProductFormVisible] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user", { withCredentials: true })
      console.log("User data:", response.data.user)
      setUser(response.data.user)
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

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

  const handleVerificationSuccess = () => {
    fetchUserData()
  }

  const handleProfilePictureChange = () => {
    fetchUserData()
  }

  const handleAddResource = () => {
    setIsAddResourceModalOpen(true)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsVerificationPopupOpen(true)}
              variant="outline"
              className="bg-green-500 text-white hover:bg-green-600 transition duration-300 ease-in-out"
            >
              <Shield className="mr-2 h-4 w-4" /> Verify Account
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
            <Button
              onClick={() => setShowOrders(true)}
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> View My Orders
            </Button>

          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={`http://localhost:4000/uploads/${user?.profilePicture}`} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button
                    onClick={() => setIsProfilePictureModalOpen(true)}
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-white shadow-md hover:bg-gray-100"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> {user?.email}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <User className="mr-2 h-4 w-4" /> {user?.role}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <Award className="mr-2 h-4 w-4" /> {user?.points} points
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>Account Verified</span>
                  {user?.isVerified ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span>Email Verified</span>
                  {user?.emailVerified ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span>Phone Verified</span>
                  {user?.numberVerified ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                </li>
                <li className="flex items-center justify-between">
                  <span>Two-Factor Auth</span>
                  {user?.twoFactorEnabled ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                </li>
              </ul>
            </CardContent>
          </Card>
          {user?.role !== "GENERAL" && (
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Add Product</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsAddProductFormVisible(!isAddProductFormVisible)}>
                  {isAddProductFormVisible ? "Hide Form" : "Show Form"}
                </Button>
              </CardHeader>
              <CardContent>
                {isAddProductFormVisible && (
                  <div className="mt-4">
                    <AddProductForm />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductSlider />
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Resources</CardTitle>
              <Button onClick={handleAddResource} variant="outline" size="icon" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResourceList />
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showOrders} onOpenChange={setShowOrders}>
        <DialogContent className="sm:max-w-[80%]">
          <DialogHeader>
            <DialogTitle>My Orders</DialogTitle>
          </DialogHeader>
          <OrderList />
        </DialogContent>
      </Dialog>

      <Dialog open={showResources} onOpenChange={setShowResources}>
        <DialogContent className="sm:max-w-[80%]">
          <DialogHeader>
            <DialogTitle>My Resources</DialogTitle>
          </DialogHeader>
          {/* Add your resources list component here */}
        </DialogContent>
      </Dialog>

      <VerificationPopup
        isOpen={isVerificationPopupOpen}
        onClose={() => setIsVerificationPopupOpen(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <ChangeProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={() => setIsProfilePictureModalOpen(false)}
        onProfilePictureChange={handleProfilePictureChange}
      />
      <Dialog open={isAddResourceModalOpen} onOpenChange={setIsAddResourceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <AddResourceForm onSuccess={() => setIsAddResourceModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

