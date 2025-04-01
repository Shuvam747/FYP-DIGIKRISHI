import { FileX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NoContentFound() {
  return (
    <Card className="max-w-md mx-auto mt-12 text-center">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">No Resources Found</CardTitle>
      </CardHeader>
      <CardContent>
        <FileX className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          We couldn't find any resources at the moment. Please check back later or try a different search.
        </p>
      </CardContent>
    </Card>
  )
}