"use client";
import React, { useEffect, useState, useRef } from "react";
import SupportComponent from "../tickets/chatPage/page";

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [problemCategory, setProblemCategory] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");

  // Separate state to handle support box visibility for each order
  const [supportBoxOpen, setSupportBoxOpen] = useState<{ [key: string]: boolean }>({});
  const [reportProblemModalOpen, setReportProblemModalOpen] = useState<{ [key: string]: boolean }>({});

  const supportBoxRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
          userId: selectedOrder.userId,
          orderId: selectedOrder.id,
          category: problemCategory,
          description: problemDescription,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to report problem");
      }
      setReportProblemModalOpen((prev) => ({ ...prev, [selectedOrder.id]: false }));
      alert("Problem reported successfully");
    } catch (error) {
      alert("Failed to submit problem");
    }
  };

  const toggleSupportBox = (orderId: string) => {
    setSupportBoxOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const toggleReportProblemModal = (orderId: string) => {
    setReportProblemModalOpen((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    setSelectedOrder(orders.find((order) => order.id === orderId) || null); // Set selected order when modal is opened
  };

  // Close support box if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if the click was outside of any support box
      if (supportBoxRef.current) {
        for (const key in supportBoxRef.current) {
          if (
            supportBoxRef.current[key] &&
            !supportBoxRef.current[key]?.contains(target) &&
            supportBoxOpen[key]
          ) {
            setSupportBoxOpen((prev) => ({ ...prev, [key]: false }));
          }
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [supportBoxOpen]);

  if (loading) return <div className="text-center text-xl text-gray-700">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-10 relative">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">My Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No orders found</div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl duration-300"
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

              {/* Button to toggle support box */}
              <button 
                className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                onClick={() => toggleSupportBox(order.id)}
              >
                {supportBoxOpen[order.id] ? "Close Support Chat" : "Open Support Chat"}
              </button>

              {/* Button to toggle ticket reporting modal */}
              <button
                className="mt-4 w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                onClick={() => toggleReportProblemModal(order.id)}
              >
                Report Problem
              </button>

              {/* Render support box for the selected order */}
              {supportBoxOpen[order.id] && (
                <div className="mt-4" ref={(el) => (supportBoxRef.current[order.id] = el)}>
                  <SupportComponent orderId={order.id} customerId={order.userId} />
                </div>
              )}

              {/* Render problem reporting modal */}
              {reportProblemModalOpen[order.id] && (
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
                    <button
                      className="bg-blue-500 text-white p-2 rounded w-full"
                      onClick={handleReportProblem} // Trigger the report problem function
                    >
                      Submit
                    </button>
                    <button className="mt-2 text-gray-500" onClick={() => setReportProblemModalOpen((prev) => ({ ...prev, [order.id]: false }))}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
