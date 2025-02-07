import { useState } from "react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
  categories: { id: string; name: string }[];
}

const ProductModal = ({ isOpen, onClose, onSubmit, categories }: ProductModalProps) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    discount: "",
    categoryId: "",
    images: [] as File[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList | null; // Explicitly define files
    if (files && files.length > 0) {
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }));
    }
  };
  
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.images.length < 1) {
      alert("Please upload at least one image.");
      return;
    }
    onSubmit(newProduct);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      discount: "",
      categoryId: "",
      images: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            required
            className="border p-2 w-full rounded"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            required
            className="border p-2 w-full rounded"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            placeholder="Price"
            required
            type="number"
            className="border p-2 w-full rounded"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <select
            className="border p-2 w-full rounded"
            required
            value={newProduct.categoryId}
            onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full rounded"
          />
          <div className="mt-4">
            {newProduct.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {newProduct.images.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} alt={`Image-${index}`} className="w-16 h-16 object-cover" />
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;