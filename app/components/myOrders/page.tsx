"use client";
import React, { useEffect, useState } from "react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/myOrders"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("An error occurred. Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">My Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No orders found</div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order?.id}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Order #{order?.razorpay_order_id || "N/A"}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Product:</span> {order?.product?.name || "N/A"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Quantity:</span> {order?.quantity}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Payment Status:</span> {order?.status}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Price:</span> ${(order?.price / 100).toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Order Date:</span>{" "}
                  {new Date(order?.createdAt).toLocaleDateString()}
                </p>
                {order?.razorpay_payment_id && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Payment ID:</span> {order?.razorpay_payment_id}
                  </p>
                )}
              </div>
              <button className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
                Need Help?
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
