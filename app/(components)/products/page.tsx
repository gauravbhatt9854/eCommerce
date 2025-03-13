"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../provider/AppStateProvider";
import ProductCard from "./child/ProductCard";
import CategoryModal from "./child/CategoryModal";
import ProductModal from "./child/ProductModal";

const ProductsPage = () => {
  const { isAdmin } = useAppState();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const fetchProducts = async (category: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?category=${category !== "all" ? category : ""}`);
      if (!res.ok) console.log("Failed to fetch products");
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
      if (!res.ok) console.log("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleNewCategorySubmit = (categoryName: string) => {
    fetch("/api/categories/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    })
      .then(() => {
        alert("Category added successfully!");
        fetchCategories();
      })
      .catch(() => alert("Failed to add category."));
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

      {/* Filter by Category */}
      <div className="mb-6 flex space-x-4">
        <select
          className="px-4 py-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <div className="mb-8 space-x-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Add Category</button>
          <button onClick={() => setIsProductModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md" disabled={!categories.length}>
            Add Product
          </button>
        </div>
      )}

      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSubmit={handleNewCategorySubmit} />
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} categories={categories} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} descHandler={(id) => router.push(`/products/${id}`)} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
