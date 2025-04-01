"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { X, Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VerificationPopupProps {
  isOpen: boolean
  onClose: () => void
  onVerificationSuccess: () => void
}

export function VerificationPopup({ isOpen, onClose, onVerificationSuccess }: VerificationPopupProps) {
  const [file, setFile] = useState<File | null>(null)
  const [role, setRole] = useState<string>("")
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
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }
    if (!role) {
      toast({
        title: "Error",
        description: "Please select a role.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("role", role)

    try {
      const response = await axios.post("http://localhost:4000/api/v1/user/platform-verify", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Verification request sent successfully.",
          variant: "default",
        })
        onVerificationSuccess()
        onClose()
      }
    } catch (error) {
      console.error("Error submitting verification:", error)
      toast({
        title: "Error",
        description: "Failed to submit verification request. Please try again.",
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Platform Verification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </Label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">GENERAL</SelectItem>
                <SelectItem value="FARMER">FARMER</SelectItem>
                <SelectItem value="EXPERT">EXPERT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload Government Document
            </Label>
            <Input
              id="file"
              type="file"
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
                <CheckCircle className="mr-2 h-5 w-5" />
                Submit Verification
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

