"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../provider/AppStateProvider";
import ProductCard from "./ProductCard";
import CategoryModal from "./CategoryModal";
import ProductModal from "./ProductModal";
 
const ProductsPage = () => {
  const { isAdmin } = useAppState();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleNewCategorySubmit = (categoryName: string) => {
    fetch("/api/categories/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    })
      .then(() => alert("Category added successfully!"))
      .catch(() => alert("Failed to add category."));
  };

  const handleNewProductSubmit = (product: any) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("categoryId", product.categoryId);
    product.images.forEach((file: File, index: number) => {
      formData.append("images", file, `image-${index + 1}`);
    });

    fetch("/admin/addProduct", {
      method: "POST",
      body: formData,
    })
      .then(() => alert("Product added successfully!"))
      .catch(() => alert("Failed to add product."));
  };

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
        <div className="mb-8 space-x-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Add Category</button>
          <button onClick={() => setIsProductModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md" disabled={!categories.length}>
            Add Product
          </button>
        </div>
      )}

      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSubmit={handleNewCategorySubmit} />
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSubmit={handleNewProductSubmit} categories={categories} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} descHandler={(id) => router.push(`/components/products//${id}`)} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
