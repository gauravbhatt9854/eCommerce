"use client";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

const Page = () => {
  const params = useParams();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params?.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product. Please try again.");
      }
    };

    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <h1 className="text-3xl font-bold text-center mb-8">Product</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {product ? (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            <p className="text-gray-700 mt-2">{product.description}</p>
            <p className="text-indigo-600 font-semibold mt-4">
              ₹{product.price.toFixed(2)}
            </p>
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`px-6 py-3 text-white font-semibold rounded-lg ${loading
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
