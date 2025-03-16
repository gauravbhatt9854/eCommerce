"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SupportComponent from "./chatPage/page";

interface Ticket {
  id: string;
  orderId: string;
  userId: string;
  category: string;
  description: string;
  createdAt: string;
  status: string;
  User: any;
  Order: any;
}

const ReportsPage: React.FC = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showChat, setShowChat] = useState<{ [key: string]: boolean }>({});
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [reportStatus, setReportStatus] = useState<Record<string, string>>({});

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/ticket");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.error(data.message, data);
        setTickets([]);
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setTickets([]);
      router.push("/");
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



  const handleDeleteReport = async (reportId: string) => {
  const confirmDelete = window.confirm("Do you really want to delete this report?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`/admin/ticket/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId }),
    });

    if (response.ok) {
      setTickets((prevReports) => prevReports.filter((report) => report.id !== reportId));
    } else {
      console.error("Failed to delete report");
    }
  } catch (error) {
    console.error("Failed to delete report:", error);
  }
};

  const handleChatClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setShowChat((prevState) => ({
      ...prevState,
      [ticketId]: !prevState[ticketId],
    }));
  };

  const filteredReports = tickets.filter((report) => {
    const matchesCategory = categoryFilter ? report.category === categoryFilter : true;
    const matchesDate =
      dateFilter === "last30"
        ? new Date(report.createdAt) > new Date(new Date().setDate(new Date().getDate() - 30))
        : dateFilter === "last7"
        ? new Date(report.createdAt) > new Date(new Date().setDate(new Date().getDate() - 7))
        : dateFilter === "last1"
        ? new Date(report.createdAt) > new Date(new Date().setDate(new Date().getDate() - 1))
        : true;

    const matchesStatus = statusFilter ? report.status === statusFilter : true;

    return matchesCategory && matchesDate && matchesStatus;
  });

  if (loading) return <div className="text-center text-xl text-gray-700">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Reported Problems</h1>

      <div className="mb-6 flex justify-between">
        <div className="flex space-x-4">
          <select className="p-2 border rounded" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Select a category</option>
            <option value="Delayed Delivery">Delayed Delivery</option>
            <option value="Wrong Product">Wrong Product</option>
            <option value="Damaged Item">Damaged Item</option>
          </select>
          <select className="p-2 border rounded" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="">Select Date Range</option>
            <option value="last30">Last 30 Days</option>
            <option value="last7">Last 7 Days</option>
            <option value="last1">Last 1 Day</option>
          </select>
          <select className="p-2 border rounded" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Select Status</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center text-lg text-gray-600">No reports found</div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Report for Order #{report.Order?.Product?.name || "not found"}</h2>
                <p className="text-gray-600">
                  <span className="font-semibold">User:</span> {report.User.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Category:</span> {report.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Description:</span> {report.description}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Reported On:</span> {new Date(report.createdAt).toLocaleDateString()}
                </p>

                {/* Status Update Dropdown */}
                <div className="mt-4">
                  <label className="font-semibold">Update Status:</label>
                  <select
                    className="w-full p-2 border rounded mt-2"
                    value={reportStatus[report.id] || report.status}
                    onChange={(e) => setReportStatus({ ...reportStatus, [report.id]: e.target.value })}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                  <button
                    className="w-full mt-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => handleStatusChange(report.id)}
                  >
                    Update Status
                  </button>

                  <button
                    className="w-full mt-2 py-2 px-4 bg-rose-300 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-colors duration-300"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete Report
                  </button>
                </div>

                {/* Chat Button */}
                <div className="mt-4">
                  <button
                    className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                    onClick={() => handleChatClick(report.id)}
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col">
          {selectedTicketId && showChat[selectedTicketId] && (
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <SupportComponent orderId={tickets.find((ticket) => ticket.id === selectedTicketId)?.orderId || ""} 
                                customerId={tickets.find((ticket) => ticket.id === selectedTicketId)?.userId || ""} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
