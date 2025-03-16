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
  const [allProducts, setAllProducts] = useState<any[]>([]); // Store all products
  const [products, setProducts] = useState<any[]>([]); // Filtered products
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // ✅ Fetch categories & products (API call only once)
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products`);
      if (!res.ok) console.log("Failed to fetch products");
      const data = await res.json();
      setAllProducts(data); // Store all products
      setProducts(data); // Initialize with all products
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

  // ✅ Filter products based on selected categories (without API call)
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setProducts(allProducts); // Show all if no category is selected
    } else {
      setProducts(
        allProducts.filter((product) =>
          selectedCategories.every((catId) => product.categoryIds.includes(catId))
        )
      );
    }
  }, [selectedCategories, allProducts]);

  // ✅ Toggle category selection
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  // ✅ Handle new category submission
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

      {/* Multi-Select Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`px-3 py-1 rounded-md border ${
              selectedCategories.includes(category.id) ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="mb-8 space-x-4">
          <button onClick={() => setIsCategoryModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Add Category
          </button>
          <button onClick={() => setIsProductModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-md" disabled={!categories.length}>
            Add Product
          </button>
        </div>
      )}

      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSubmit={handleNewCategorySubmit} />
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} categories={categories} />

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} descHandler={(id) => router.push(`/products/${id}`)} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
