import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Products } from "@/type/base.type"


interface EditProductFormProps {
  product: Products
  onEditProduct: (updatedData: Partial<Products>) => void
  onEditProductImage: (imageFile: File) => void
}

export default function EditProductForm({ product, onEditProduct, onEditProductImage }: EditProductFormProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold mb-4">Edit {product.name}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          onEditProduct({
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),
            quantity: Number(formData.get("quantity")),
          })
        }}
        className="space-y-4"
      >
        <Input name="name" defaultValue={product.name} className="w-full" placeholder="Product Name" />
        <Textarea
          name="description"
          defaultValue={product.description}
          className="w-full"
          placeholder="Product Description"
        />
        <Input name="price" type="number" defaultValue={product.price} className="w-full" placeholder="Price" />
        <Input
          name="quantity"
          type="number"
          defaultValue={product.quantity}
          className="w-full"
          placeholder="Quantity"
        />
        <Button
          type="submit"
          className="w-full bg-green-500 text-white hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Save Changes
        </Button>
      </form>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Update Product Image</h4>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onEditProductImage(file)
            }
          }}
          className="w-full"
        />
      </div>
    </DialogContent>
  )
}

