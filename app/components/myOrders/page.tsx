"use client"
import React, { useEffect, useState } from 'react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders from the backend API
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/myOrders'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No orders found</div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order?.id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="text-2xl font-medium text-gray-800 mb-2">Order ID: {order?.id}</h3>
              <p className="text-gray-600">Clerk ID: <span className="font-semibold">{order?.clerkId}</span></p>
              <p className="text-gray-600">User ID: <span className="font-semibold">{order?.userId}</span></p>
              <p className="text-gray-600">Product ID: <span className="font-semibold">{order?.productId}</span></p>
              <p className="text-gray-600">Quantity: <span className="font-semibold">{order?.quantity}</span></p>
              <p className="text-gray-600">Status: <span className="font-semibold">{order?.status}</span></p>
              <p className="text-gray-600">Price: <span className="font-semibold">${(order?.price / 100).toFixed(2)}</span></p>
              <p className="text-gray-600">Created At: <span className="font-semibold">{new Date(order?.createdAt).toLocaleDateString()}</span></p>
              <p className="text-gray-600">Updated At: <span className="font-semibold">{new Date(order?.updatedAt).toLocaleDateString()}</span></p>

              {order?.razorpay_order_id && (
                <p className="text-gray-600">Razorpay Order ID: <span className="font-semibold">{order?.razorpay_order_id}</span></p>
              )}
              {order?.razorpay_payment_id && (
                <p className="text-gray-600">Razorpay Payment ID: <span className="font-semibold">{order?.razorpay_payment_id}</span></p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
