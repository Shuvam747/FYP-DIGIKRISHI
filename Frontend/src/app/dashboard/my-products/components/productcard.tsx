import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingBag, Edit } from "lucide-react"
import { Products } from "@/type/base.type"
import EditProductForm from "./productslist"

interface ProductCardProps {
  product: Products
  onViewOrders: () => void
  onEditProduct: (updatedData: Partial<Products>) => void
  onEditProductImage: (imageFile: File) => void
}

export default function ProductCard({ product, onViewOrders, onEditProduct, onEditProductImage }: ProductCardProps) {
  return (
    <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <img
          src={`http://localhost:4000/uploads/${product.image}` || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl text-gray-800">{product.name}</CardTitle>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <p className="font-semibold text-green-600">Price: ${product.price.toFixed(2)}</p>
        <p className="text-gray-700">Quantity: {product.quantity}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-gray-50">
        <Button
          variant="outline"
          className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={onViewOrders}
        >
          <ShoppingBag className="mr-2 h-4 w-4" /> View Orders
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 ease-in-out"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Product
            </Button>
          </DialogTrigger>
          <EditProductForm product={product} onEditProduct={onEditProduct} onEditProductImage={onEditProductImage} />
        </Dialog>
      </CardFooter>
    </Card>
  )
}

