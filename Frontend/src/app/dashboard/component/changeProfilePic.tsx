"use client"

import { useState } from "react"
import axios from "axios"
import { X, Upload, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ChangeProfilePictureModalProps {
  isOpen: boolean
  onClose: () => void
  onProfilePictureChange: () => void
}

export function ChangeProfilePictureModal({ isOpen, onClose, onProfilePictureChange }: ChangeProfilePictureModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "Error",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await axios.put("http://localhost:4000/api/v1/user/change-profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Profile picture updated successfully.",
          variant: "default",
        })
        onProfilePictureChange()
        onClose()
      }
    } catch (error) {
      console.error("Error changing profile picture:", error)
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <Button onClick={onClose} variant="ghost" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Change Profile Picture</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload New Profile Picture
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Upload className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Camera className="mr-2 h-5 w-5" />
                Update Profile Picture
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

