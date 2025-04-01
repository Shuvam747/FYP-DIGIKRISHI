import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { CommentSection } from "../component/comment"
import axios from "axios"
import { ResourceCard } from "./component/resourcecard"
import ResourceNotFound from "./component/resourcenotfound"

export async function getResource(id: string) {
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/resource/${id}`)
    return response.data
  } catch (error) {
    throw new Error("Failed to fetch resource")
  }
}
export default async function ResourcePage({ params }: { params: { id: string } }) {
  let resource: any
  try {
    resource = await getResource(params.id)
  } catch (error) {
    return <ResourceNotFound />
  }

  if (!resource) {
    return <ResourceNotFound />
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-green-50 min-h-screen">
      <Link href="/resource" className="inline-flex items-center text-green-700 hover:text-green-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Resources
      </Link>
      <ResourceCard resource={resource} />
      <CommentSection comments={resource.comment} resourceId={resource._id} />
    </div>
  )
}

