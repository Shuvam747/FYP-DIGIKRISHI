"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Upload, Plus } from "lucide-react"
import api from "@/lib/axios"

export function AddProductForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [availableForDelivery, setAvailableForDelivery] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("quantity", quantity)
    formData.append("availableForDelivery", String(availableForDelivery))
    photos.forEach((photo) => {
      formData.append("photos", photo)
    })
  
    try {
      const response = await api.post("/product", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
  
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Product created successfully.",
          variant: "default",
        })

        setName("")
        setDescription("")
        setPrice("")
        setQuantity("")
        setAvailableForDelivery(false)
        setPhotos([])
      }
    } catch (error) {
      console.error("Error creating product:", error)
      let errorMessage = "Failed to create product. Please try again."
  
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="availableForDelivery" checked={availableForDelivery} onCheckedChange={setAvailableForDelivery} />
        <Label htmlFor="availableForDelivery">Available for Delivery</Label>
      </div>
      <div>
        <Label htmlFor="photos">Product Photos</Label>
        <Input
          id="photos"
          type="file"
          onChange={handlePhotoChange}
          multiple
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white">
        {loading ? (
          <span className="flex items-center justify-center">
            <Upload className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Creating Product...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <Plus className="mr-2 h-5 w-5" />
            Create Product
          </span>
        )}
      </Button>
    </form>
  )
}



