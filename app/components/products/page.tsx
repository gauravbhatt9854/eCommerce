"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
}

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [] as File[],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products", { method: "POST" });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isModalOpen]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/services/checkadmin", { method: "POST" });
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdmin();
  }, []);

  const handleNewProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.images.length < 1) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      newProduct.images.forEach((file, index) =>
        formData.append("images", file, `image-${index + 1}`)
      );

      const res = await fetch("/admin/addProduct", { method: "POST", body: formData });

      if (!res.ok) throw new Error("Failed to add new product");

      setNewProduct({ name: "", description: "", price: "", images: [] });
      setIsModalOpen(false);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding new product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files)],
      }));
    }
  };

  const descHandler = (id: string) => router.push(`${window.location.pathname}/${id}`);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Products</h1>

      {isAdmin && (
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            Add Product
          </button>
        </div>
      )}

      {/* Modal for adding new product */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleNewProductSubmit} className="space-y-4">
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Name"
                required
                className="border p-2 w-full rounded"
              />
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                required
                className="border p-2 w-full rounded"
              />
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="Price"
                required
                className="border p-2 w-full rounded"
              />
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border p-2 w-full rounded" />
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} descHandler={descHandler} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product, descHandler }: { product: Product; descHandler: (id: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev === product.imageUrls.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? product.imageUrls.length - 1 : prev - 1));

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="relative w-full h-48 overflow-hidden rounded-md">
        {product.imageUrls.length > 0 && (
          <>
            <img
              src={product.imageUrls[currentIndex]}
              alt={product.name}
              className="w-full h-full object-cover rounded-md transition-transform duration-500"
            />

            {product.imageUrls.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                  &#9664;
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                  &#9654;
                </button>
              </>
            )}
          </>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-indigo-600 font-semibold mt-4">₹{product.price}</p>
      <button onClick={() => descHandler(product.id)} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md">
        See Description
      </button>
    </div>
  );
};

export default ProductsPage;
