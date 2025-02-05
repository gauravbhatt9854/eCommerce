"use client";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useAdmin } from "../../provider/AdminProvider";


interface Product {
  name: string;
  description: string;
  price: number;
  imageUrls: string[]
}

const Page = () => {
  const {isAdmin} = useAdmin();
  const params = useParams();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To toggle product edit mode
  const [editedProduct, setEditedProduct] = useState<Product | null>(null); // For handling edited values
  const router = useRouter();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params?.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params?.id }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch product details");
          router.push("/components/products");
        }

        const data = await res.json();
        setProduct(data);
        setEditedProduct(data); // Preload editedProduct with the fetched product data
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product. Please try again.");
        router.push("/components/products");
      }
    };

    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id]);

  // Handle product editing
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveChanges = async () => {
    if (!editedProduct) return; // Ensure the product ID is set
    setEditedProduct((prev) => (prev ? { ...prev, id: params?.id } : null));
    try {
      const res = await fetch(`/admin/editProduct`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProduct),
      });

      if (res.ok) {
        setProduct(editedProduct); // Update the displayed product
        setIsEditing(false); // Close the edit form
        alert("Product details updated successfully");
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving product changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!product) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/admin/deleteProduct`, {
        method: "DELETE",
        body: JSON.stringify({ id: params?.id }),
      });

      if (res.ok) {
        alert("Product deleted successfully");
        router.push("/components/products"); // Redirect to product list
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!product) {
      alert("Product details are missing!");
      return;
    }

    const price = Number(product.price) || 0;
    if (!price || isNaN(price) || price <= 0) {
      alert("Invalid product price!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100 }), // Amount in paise
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const order = await response.json();

      const dbOrderData = {
        productId: params?.id, // Ensure `params?.id` is a string
        razorpay_order_id: order.id,
        price: price,
        email: user?.emailAddresses[0]?.emailAddress,
      };

      const dbOrder = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbOrderData),
      });

      if (!dbOrder.ok) {
        return alert("Failed to create order. Please try again.");
      }
      const dbOrderResponse = await dbOrder.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is correctly set in .env
        amount: order.amount, // Amount in paise
        currency: "INR",
        name: "I am Gaurav",
        description: "Test Transaction",
        order_id: order.id, // Order ID from backend
        handler: async function (response: any) {
          try {
            // Verify payment signature
            const sign = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              DB_ORDER_ID: dbOrderResponse.orderId,
            };

            const verificationResponse = await fetch("/api/webhook/razorpay", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(sign),
            });

            const verificationResult = await verificationResponse.json();
            console.log("Verification Result:", verificationResult);

            router.push("/success");
          } catch (error) {
            console.error("Error handling payment:", error);
            alert("Payment processing failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.fullName || "Guest",
          email: user?.emailAddresses[0]?.emailAddress || "sample@gmail.com",
        },
        theme: {
          color: "#F37254",
        },
      };

      const payment = new (window as any).Razorpay(options);
      payment.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">Product Details</h1>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
        {product ? (
          <div className="flex flex-col lg:flex-row w-full bg-white shadow-2xl rounded-xl overflow-hidden">
            {/* Left Side: Product Image */}
            <div className="w-full lg:w-1/2 p-8">
              <div className="product-images">
                {product?.imageUrls?.length > 0 && (
                  <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    spaceBetween={50}
                    slidesPerView={1}
                    loop={true}
                    className="mySwiper"
                  >
                    {product.imageUrls.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`Product Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>

            {/* Right Side: Product Details */}
            <div className="w-full lg:w-1/2 p-8">
              <div className="flex flex-col mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h2>
                <p className="text-lg text-gray-600 mb-8">{product.description}</p>
                <p className="text-indigo-700 font-semibold text-3xl">₹{product.price}</p>
              </div>

              {/* Admin Actions & Editing Form */}
              {isAdmin && !isEditing && (
                <div className="mt-8 flex space-x-8">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-700 transition"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg shadow-xl hover:bg-red-700 transition"
                  >
                    Delete Product
                  </button>
                </div>
              )}

              {/* Edit Product Form */}
              {isAdmin && isEditing && (
                <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                  <input
                    type="text"
                    name="name"
                    value={editedProduct?.name || ""}
                    onChange={handleEditChange}
                    className="w-full p-4 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Product Name"
                  />
                  <textarea
                    name="description"
                    value={editedProduct?.description || ""}
                    onChange={handleEditChange}
                    className="w-full p-4 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Product Description"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editedProduct?.price || ""}
                    onChange={handleEditChange}
                    className="w-full p-4 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Product Price"
                  />
                  <div className="flex space-x-8">
                    <button
                      onClick={handleSaveChanges}
                      className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-4 bg-gray-400 text-white font-semibold rounded-lg shadow-xl hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              {!isEditing  && (
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`mt-8 px-8 py-4 w-full text-white font-semibold rounded-lg shadow-xl ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition"
                    }`}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading product details...</p>
        )}
      </div>
    </div>




  );
};

export default Page;
