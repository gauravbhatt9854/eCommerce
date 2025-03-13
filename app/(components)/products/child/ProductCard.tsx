"use client"
import { useState } from "react";
import { Product } from "@prisma/client";
import { useAppState } from "../../provider/AppStateProvider";

const ProductCard = ({ product, descHandler }: { product: Product; descHandler: (id: string) => void;}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isAdmin } = useAppState();

  const nextImage = () => setCurrentIndex((prev) => (prev === product.imageUrls.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? product.imageUrls.length - 1 : prev - 1));

  const toggleActive = async (id: string) => {
    try {
      const res = await fetch("/admin/product/isActive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
  
      if (!res.ok) console.log("Failed to change active status");
    } catch (error) {
      console.error("Error toggling active status in products:", error);
    } finally {
      window.location.reload(); // Reloads the current page
    }
  };
  

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
<div className="flex justify-between items-center mt-4">
<button onClick={() => descHandler(product.id)} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md">
        See Description
      </button>

{
  isAdmin && (
    <button onClick={() => toggleActive(product.id)} className={`mt-4 px-4 py-2 ${product.isActive ?" bg-green-500" : "bg-red-500"} text-white rounded-md`}>
      Visibility : {product.isActive ? "Yes" : "No"}
    </button>
  )
}
</div>
    </div>
  );
};

export default ProductCard;
