"use client";
import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  userId: string;
  razorpay_order_id?: string;
  product: { name: string };
  quantity: number;
  status: string;
  price: number;
  createdAt: string;
  razorpay_payment_id?: string;
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [problemCategory, setProblemCategory] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/myOrders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        setError("An error occurred. Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReportProblem = async () => {
    if (!selectedOrder) return;
    try {
      const response = await fetch("/api/orders/reportProblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId : selectedOrder.userId,
          orderId: selectedOrder.id,
          category: problemCategory,
          description: problemDescription,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to report problem");
      }
      setShowModal(false);
    } catch (error) {
      alert("Failed to submit problem");
    }
  };

  if (loading) return <div className="text-center text-xl text-gray-700">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">My Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No orders found</div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Order #{order.razorpay_order_id || "N/A"}
              </h2>
              <p className="text-gray-600"><span className="font-semibold">Product:</span> {order.product.name}</p>
              <p className="text-gray-600"><span className="font-semibold">Quantity:</span> {order.quantity}</p>
              <p className="text-gray-600"><span className="font-semibold">Payment Status:</span> {order.status}</p>
              <p className="text-gray-600"><span className="font-semibold">Price:</span> ${(order.price / 100).toFixed(2)}</p>
              <p className="text-gray-600"><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              {order.razorpay_payment_id && (
                <p className="text-gray-600"><span className="font-semibold">Payment ID:</span> {order.razorpay_payment_id}</p>
              )}
              <button 
                className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                onClick={() => { setSelectedOrder(order); setShowModal(true); }}
              >
                Need Help?
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Report a Problem</h2>
            <select 
              className="w-full p-2 mb-4 border rounded"
              value={problemCategory}
              onChange={(e) => setProblemCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Delayed Delivery">Delayed Delivery</option>
              <option value="Wrong Product">Wrong Product</option>
              <option value="Damaged Item">Damaged Item</option>
            </select>
            <textarea 
              className="w-full p-2 mb-4 border rounded"
              placeholder="Describe the issue..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
            ></textarea>
            <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleReportProblem}>
              Submit
            </button>
            <button className="mt-2 text-gray-500" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
