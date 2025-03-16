"use client";
import React, { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";

type Order = Prisma.OrderGetPayload<{ include: { User: true; Product: true; DeliveryPerson: true } }>;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [deliveryFilter, setDeliveryFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/admin/allOrder");
        if (!response.ok) {
          console.log("An error occurred. Please try again");
          return;
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

  // Function to cancel (delete) an order by sending its id via a POST request
  const cancelOrder = async (orderId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmDelete) return;
  
    try {
      
      const response = await fetch("/admin/deleteOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId }),
      });

      if (!response.ok) {
        console.error("Failed to cancel order");
        return;
      }

      // Update the UI by removing the canceled order
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Error canceling order:", err);
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  const filteredOrders = orders.filter((order) => {
    return (
      (paymentFilter === "ALL" || order.paymentStatus === paymentFilter) &&
      (deliveryFilter === "ALL" || order.deliveryStatus === deliveryFilter) &&
      (!startDate || new Date(order.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(order.createdAt) <= new Date(endDate))
    );
  });

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">All Orders (Admin)</h1>
      
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select className="px-4 py-2 border rounded-md" onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="ALL">All Payments</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
        </select>

        <select className="px-4 py-2 border rounded-md" onChange={(e) => setDeliveryFilter(e.target.value)}>
          <option value="ALL">All Deliveries</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>

        <input type="date" className="px-4 py-2 border rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="px-4 py-2 border rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No orders found</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Order #{order.razorpay_order_id || "N/A"}</h2>
              <p className="text-gray-600"><span className="font-semibold">User:</span> {order.User?.name || "Unknown"} ({order.User?.email})</p>
              <p className="text-gray-600"><span className="font-semibold">Product:</span> {order.Product?.name || "N/A"}</p>
              <p className="text-gray-600"><span className="font-semibold">Quantity:</span> {order.quantity}</p>
              <p className="text-gray-600"><span className="font-semibold">Payment Status:</span> {order.paymentStatus}</p>
              <p className="text-gray-600"><span className="font-semibold">Delivery Status:</span> {order.deliveryStatus}</p>
              <p className="text-gray-600"><span className="font-semibold">Price:</span> ₹{(order.price).toFixed(2)}</p>
              <p className="text-gray-600"><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600"><span className="font-semibold">Delivery Date:</span> {new Date(Number(order?.deliveryDate)).toLocaleDateString()}</p>
              <p className="text-gray-600"><span className="font-semibold">Delivery Partner:</span> {order?.DeliveryPerson?.name}</p>
              
              <button 
                className="mt-4 w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                onClick={() => cancelOrder(order.id)}
              >
                Cancel Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
