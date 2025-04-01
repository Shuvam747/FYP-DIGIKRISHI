"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, Star, Truck, Store, ShoppingCart, Heart, AlertCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { DELIVERY_TYPE, Product } from "@/type/base.type"


export function ProductSlider() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [deliveryType, setDeliveryType] = useState<DELIVERY_TYPE>(DELIVERY_TYPE.DELIVERY)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get("http://localhost:4000/api/v1/product", { withCredentials: true })
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleNextProduct = () => {
    if (products.length > 0) {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length)
    }
  }

  const handlePrevProduct = () => {
    if (products.length > 0) {
      setCurrentProductIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmittingReview(true)
      await axios.post(
        `http://localhost:4000/api/v1/product/review/${products[currentProductIndex]._id}`,
        {
          rating: reviewRating,
          comment: reviewComment,
        },
        { withCredentials: true },
      )
      toast({
        title: "Success",
        description: "Review posted successfully.",
        variant: "default",
      })
      setReviewRating(5)
      setReviewComment("")
    } catch (error) {
      console.error("Error posting review:", error)
      toast({
        title: "Error",
        description: "Failed to post review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/order",
        {
          productId: currentProduct._id,
          deliveryType: deliveryType,
        },
        { withCredentials: true },
      )

      // Assuming the response contains the necessary data for eSewa payment
      const { formData } = response.data

      // Create a form element
      const form = document.createElement("form")
      form.method = "POST"
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"

      // Create input fields and append them to the form
      for (const [key, value] of Object.entries(formData)) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value as string
        form.appendChild(input)
      }

      // Append the form to the body and submit it
      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <ProductSliderSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (products.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Products</AlertTitle>
        <AlertDescription>There are no products available at the moment.</AlertDescription>
      </Alert>
    )
  }

  const currentProduct = products[currentProductIndex]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Product Showcase</CardTitle>
        <Link href="/dashboard/my-products" className="block">
                <Button variant="outline" className="w-full">
                  View My Products
                </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={`http://localhost:4000/uploads/${currentProduct.image}` || "/placeholder.svg"}
                alt={`${currentProduct.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  ${currentProduct.price.toFixed(2)}
                </Badge>
                <div className="flex space-x-2">
                  <Button size="icon" variant="secondary">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Button onClick={handlePrevProduct} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={handleNextProduct} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">{currentProduct.name}</h3>
              <p className="text-muted-foreground">{currentProduct.description}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Seller: {currentProduct.seller.username}</Badge>
                {currentProduct.isVerified && <Badge variant="secondary">Verified Product</Badge>}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">In Stock: {currentProduct.quantity}</Badge>
                {currentProduct.availableForDelivery && <Badge variant="secondary">Available for Delivery</Badge>}
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Delivery Options</h4>
              <RadioGroup
                defaultValue={DELIVERY_TYPE.DELIVERY}
                onValueChange={(value) => setDeliveryType(value as DELIVERY_TYPE)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={DELIVERY_TYPE.DELIVERY} id="delivery" />
                  <Label htmlFor="delivery" className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Home Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={DELIVERY_TYPE.PICKUP} id="pickup" />
                  <Label htmlFor="pickup" className="flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    Store Pickup
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Button onClick={handleOrder} className="w-full">
                Order Now
              </Button>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Customer Reviews</h4>
          {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {currentProduct.reviews
                .filter((review, index, self) => index === self.findIndex((t) => t._id === review._id))
                .map((review) => (
                  <div key={review._id} className="bg-muted p-2 rounded-md text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.user.username}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground line-clamp-2">{review.comment}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className={`p-0 ${reviewRating >= star ? "text-yellow-400" : "text-muted-foreground"}`}
                  onClick={() => setReviewRating(star)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Write your review..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="flex-grow"
            />
          </div>
          <Button onClick={handleSubmitReview} className="w-full" disabled={submittingReview}>
            {submittingReview ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function ProductSliderSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-px w-full my-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 flex-grow" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </CardFooter>
    </Card>
  )
}

