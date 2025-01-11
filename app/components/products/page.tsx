"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  function descHandler(id: string) {
    const currentPath = window.location.pathname; // Get current path
    const newPath = `${currentPath}/${id}`; // Append `/id` to the current path
    router.push(newPath); // Navigate to the new path
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            <p className="text-gray-700 mt-2">{product.description}</p>
            <p className="text-indigo-600 font-semibold mt-4">${product.price.toFixed(2)}</p>
            <button onClick={()=> descHandler(product.id)}>See description</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
