"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, Edit } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

interface Resource {
  _id: string
  title: string
  description: string
  category: string
  resourceType: string
  url?: string
  photo?: string[]
  file?: string[]
  isExpertVerified: boolean
  language: string
  votes: number
  createdBy: string
}

export function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const { toast } = useToast()

  const fetchResources = async () => {
    try {
      const response = await axios.get<Resource[]>("http://localhost:4000/api/v1/resource/search/my-resource", {
        withCredentials: true,
      })
      setResources(response.data)
    } catch (error) {
      console.error("Error fetching resources:", error)
      setError("Failed to load resources. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    fetchResources()
  }

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource)
  }

  const handleCloseModal = () => {
    setEditingResource(null)
  }

  const handleSaveResource = async (updatedResource: Resource) => {
    try {
      await axios.put(`/api/resources/${updatedResource._id}`, updatedResource, {
        withCredentials: true,
      })
      toast({
        title: "Success",
        description: "Resource updated successfully.",
      })
      fetchResources()
      handleCloseModal()
    } catch (error) {
      console.error("Error updating resource:", error)
      toast({
        title: "Error",
        description: "Failed to update resource. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <ResourceListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
        <Button size="sm" variant="outline" onClick={handleRetry} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-[600px] w-full rounded-md border">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No resources available</div>
          ) : (
            resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} onEdit={() => handleEditResource(resource)} />
            ))
          )}
        </div>
      </ScrollArea>

      <Dialog open={editingResource !== null} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          {editingResource && (
            <EditResourceForm resource={editingResource} onSave={handleSaveResource} onClose={handleCloseModal} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function ResourceCard({ resource, onEdit }: { resource: Resource; onEdit: () => void }) {
  const isCreatedByUser = resource.createdBy === "current_user_id" // Replace with actual user ID check

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <CardDescription>{resource.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {resource?.photo && resource?.photo.length > 0 ? (
          <div className="relative w-full h-40 mb-4">
            <Image
              src={resource.photo[0] || "/placeholder.svg"}
              alt={resource.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
        ) : (
          <div className="h-40 mb-4 bg-gray-200 rounded-md flex justify-center items-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <p className="text-sm text-gray-500 mb-2 line-clamp-3">{resource.description}</p>
        <div className="mt-auto">
          <p className="text-xs text-gray-400">Type: {resource.resourceType}</p>
          <p className="text-xs text-gray-400">Votes: {resource.votes}</p>
          {resource.isExpertVerified && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
              Expert Verified
            </span>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          {resource.file && resource.file.length > 0 && (
            <Button size="sm" variant="outline" asChild>
              <a href={resource.file[0]} download>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          )}
          <Button size="sm" variant="outline" asChild>
            <Link href={`/resource/${resource._id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit
            </Link>
          </Button>
          {isCreatedByUser && (
            <Button size="sm" variant="outline" onClick={onEdit} className="ml-2">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ResourceListSkeleton() {
  return (
    <ScrollArea className="h-[600px] w-full rounded-md border">
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-16 w-full mb-2" />
              <div className="mt-auto">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4 mt-1" />
              </div>
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

function EditResourceForm({
  resource,
  onSave,
  onClose,
}: { resource: Resource; onSave: (resource: Resource) => Promise<void>; onClose: () => void }) {
  const [title, setTitle] = useState(resource.title)
  const [description, setDescription] = useState(resource.description)
  const [category, setCategory] = useState(resource.category)

  const handleSave = async () => {
    await onSave({ ...resource, title, description, category })
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Description"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Category"
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

