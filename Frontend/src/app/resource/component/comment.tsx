import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  _id: string
  user: {
    _id: string
    name: string
    avatar: string
  }
  content: string
  createdAt: string
}

interface CommentSectionProps {
  comments: Comment[]
  resourceId: string
}

export function CommentSection({ comments, resourceId }: CommentSectionProps) {
    console.log(resourceId)
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-800">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-4">
              <Avatar>
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-green-800">{comment.user.name}</h4>
                  <p className="text-xs text-green-600">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-1 text-sm text-green-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="mt-6">
          <Textarea
            placeholder="Add a comment..."
            className="w-full p-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          <Button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 text-white">
            Post Comment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}