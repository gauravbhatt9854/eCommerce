"use client";

import React, { useEffect, useState } from "react";

interface Ticket {
  id: string;
  orderId: string;
  userId: string;
  category: string;
  description: string;
  createdAt: string;
  status: string;
  user: {
    name: string;
  };
}

const ReportsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [reportStatus, setReportStatus] = useState<Record<string, string>>({}); // Manage status per report

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/ticket");
      const data = await response.json();

      // Debugging log
      console.log("Fetched tickets data:", data);

      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setTickets([]);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setTickets([]); // Reset in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId: string) => {
    const selectedStatus = reportStatus[reportId];
    if (!selectedStatus) return;

    try {
      const response = await fetch(`/admin/ticket/updateStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status: selectedStatus }),
      });

      const updatedReport = await response.json();
      if (response.ok) {
        setTickets((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId ? { ...report, status: updatedReport.status } : report
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`/admin/ticket/deleteTicket}`, {
        method: "DELETE",
        body : JSON.stringify({ id: ticketId }),
      });

      if (response.ok) {
        setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
      }
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  }

  // Filter reports based on selected filters
  const filteredReports = tickets.filter((report) => {
    const matchesCategory = categoryFilter ? report.category === categoryFilter : true;
    const matchesDate =
      dateFilter === "last30" ? new Date(report.createdAt) > new Date(new Date().setDate(new Date().getDate() - 30)) :
      dateFilter === "last7" ? new Date(report.createdAt) > new Date(new Date().setDate(new Date().getDate() - 7)) : 
      dateFilter === "last1" ? new Date(report.createdAt) > new Date(new Date().setDate(new Date().getDate() - 1)) :
      true;

    const matchesStatus = statusFilter ? report.status === statusFilter : true;

    return matchesCategory && matchesDate && matchesStatus;
  });

  if (loading) return <div className="text-center text-xl text-gray-700">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Reported Problems</h1>

      <div className="mb-6 flex justify-between">
        <div className="flex space-x-4">
          <select
            className="p-2 border rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Delayed Delivery">Delayed Delivery</option>
            <option value="Wrong Product">Wrong Product</option>
            <option value="Damaged Item">Damaged Item</option>
          </select>
          <select
            className="p-2 border rounded"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">Select Date Range</option>
            <option value="last30">Last 30 Days</option>
            <option value="last7">Last 7 Days</option>
            <option value="last1">Last 1 Day</option>
          </select>
          <select
            className="p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredReports.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No reports found</div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Report for Order #{report.orderId}</h2>
              <p className="text-gray-600"><span className="font-semibold">User:</span> {report.user.name}</p>
              <p className="text-gray-600"><span className="font-semibold">Category:</span> {report.category}</p>
              <p className="text-gray-600"><span className="font-semibold">Description:</span> {report.description}</p>
              <p className="text-gray-600"><span className="font-semibold">Reported On:</span> {new Date(report.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600"><span className="font-semibold">Status:</span> {report.status}</p>
              <div className="mt-4">
                <select
                  className="p-2 border rounded"
                  value={reportStatus[report.id] || ""}
                  onChange={(e) => setReportStatus({ ...reportStatus, [report.id]: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="PENDING">PENDING</option>
                </select>
                <button
                  className="mt-2 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleStatusChange(report.id)}
                >
                  Update Status
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
