import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, ExternalLink, CheckCircle } from "lucide-react"

export interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  resourceType: 'pdf' | 'video' | 'article';
  url: string;
  uploadedBy: string;
  photo: string[];
  file: string[];
  isExpertVerified: boolean;
  language: string;
  votes: number;
  comment: string[];
  createdAt: string;
  updatedAt: string;
}

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-green-50">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-green-800">{resource.title}</CardTitle>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {resource.category}
          </Badge>
        </div>
        <CardDescription className="text-green-700">
          {new Date(resource.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-green-700 mb-4">{resource.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
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
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-green-100 py-2">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-green-700">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {resource.votes}
          </Button>
          <Button variant="ghost" size="sm" className="text-green-700">
            <MessageSquare className="w-4 h-4 mr-1" />
            {resource.comment.length}
          </Button>
        </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/resource/${resource._id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              Visit
            </Link>
          </Button>

      </CardFooter>
    </Card>
  )
}

