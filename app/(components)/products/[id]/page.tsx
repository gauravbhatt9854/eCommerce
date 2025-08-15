"use client";
import Script from "next/script";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useAppState } from "../../provider/AppStateProvider";
import ProductImages from "./child/ProductImages";
import ProductInfo from "./child/ProductInfo";
import AdminActions from "./child/AdminActions";
import EditProductForm from "./child/EditProductForm";
import PaymentButton from "./child/PaymentButton";

const page = () => {
  const { isAdmin, user } = useAppState();
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>();

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/products/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id }),
    })
      .then(res => res.json())
      .then(data => { setProduct(data); setEditedProduct(data); })
      .catch(() => { alert("Failed to load product"); router.push("/products"); });
  }, [params?.id]);

const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setEditedProduct(prev => prev ? { ...prev, [name]: value } : undefined);
};

  const handleSaveChanges = async () => {
    if (!editedProduct) return;
    await fetch("/admin/editProduct", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedProduct),
    });
    setProduct(editedProduct);
    setIsEditing(false);
    alert("Product updated");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    await fetch("/admin/deleteProduct", {
      method: "DELETE",
      body: JSON.stringify({ id: params?.id }),
    });
    alert("Deleted");
    router.push("/products");
  };

  return (
    <div className="max-w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">Product Details</h1>

      {product ? (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex flex-col lg:flex-row w-full bg-white shadow-2xl rounded-xl overflow-hidden">
            <div className="w-full lg:w-1/2 p-8">
              <ProductImages imageUrls={product.imageUrls} />
            </div>

            <div className="w-full lg:w-1/2 p-8">
              <ProductInfo name={product.name} description={product.description} price={product.price} />
              {isAdmin && !isEditing && <AdminActions onEdit={() => setIsEditing(true)} onDelete={handleDelete} />}
              {isAdmin && isEditing && <EditProductForm editedProduct={editedProduct} onChange={handleEditChange} onSave={handleSaveChanges} onCancel={() => setIsEditing(false)} />}
              {<PaymentButton productId={Array.isArray(params.id) ? params.id[0] : params.id!} price={product.price} userEmail={user?.email} />}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading product details...</p>
      )}
    </div>
  );
};

export default page;