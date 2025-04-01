import Image from "next/image"
import Link from "next/link"
import { ExternalLink, ThumbsUp, MessageSquare, CheckCircle, Calendar, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/seperator"


export function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card className="overflow-hidden bg-white shadow-lg mb-8">
      <CardHeader className="bg-green-100">
        <div className="flex justify-between items-start">
          <CardTitle className="text-3xl font-bold text-green-800">{resource.title}</CardTitle>
          <Badge variant="outline" className="bg-green-200 text-green-800">
            {resource.category}
          </Badge>
        </div>
        <CardDescription className="text-green-700 flex items-center mt-2">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(resource.createdAt).toLocaleDateString()}
          <Separator className="mx-2" orientation="vertical" />
          <User className="w-4 h-4 mr-2" />
          {resource.uploadedBy?.name || "Unknown"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {resource.photo?.length > 0 && (
          <div className="mb-6">
            <Image
              src={resource.photo[0] || "/placeholder.svg"}
              alt={resource.title}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full"
            />
          </div>
        )}
        <p className="text-green-700 text-lg mb-6">{resource.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="bg-green-200 text-green-800">
            {resource.resourceType}
          </Badge>
          <Badge variant="secondary" className="bg-green-200 text-green-800">
            {resource.language}
          </Badge>
          {resource.isExpertVerified && (
            <Badge variant="secondary" className="bg-green-200 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Expert Verified
            </Badge>
          )}
        </div>

        {resource.url && (
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
            <Link href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Resource
            </Link>
          </Button>
        )}
      </CardContent>

      <CardFooter className="bg-green-100 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-green-700">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {resource.votes} Votes
          </Button>
          <Button variant="ghost" size="sm" className="text-green-700">
            <MessageSquare className="w-4 h-4 mr-1" />
            {resource.comment?.length} Comments
          </Button>
        </div>
        <p className="text-sm text-green-600">Last updated: {new Date(resource.updatedAt).toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  )
}