"use client";
import React, { useState, useEffect } from "react";
import SupportComponent from "./selfBox/page";

const AdminDashboard: React.FC = () => {
  const [activeCases, setActiveCases] = useState<any[]>([]); // Store active cases (orderId + senderId)
  const [filteredCases, setFilteredCases] = useState<any[]>([]); // Store filtered cases
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query for filtering
  const [openChats, setOpenChats] = useState<Set<string>>(new Set()); // Track opened chat boxes by key (orderId-senderId)

  // Fetch active cases on component mount
  useEffect(() => {
    const fetchActiveCases = async () => {
      try {
        const response = await fetch("/components/support/adminSupport/fetch"); // Fetch all unique pairs of orderId and senderId
        const data = await response.json();
        setActiveCases(data); // Update the active cases with unique orderId, senderId pairs
        setFilteredCases(data); // Initially set filtered cases to all active cases
      } catch (error) {
        console.error("Error fetching active cases:", error);
      }
    };

    fetchActiveCases();
  }, []);


  // Handle the search input change and filter active cases
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = activeCases.filter(
      (caseItem) =>
        caseItem.orderId.toLowerCase().includes(query) ||
        caseItem.senderId.toLowerCase().includes(query)
    );
    setFilteredCases(filtered);
  };

  // Toggle the visibility of a chat box
  const toggleChatBox = (orderId: string, senderId: string) => {
    const key = `${orderId}-${senderId}`;
    setOpenChats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key); // Close the chat box
      } else {
        newSet.add(key); // Open the chat box
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Active Customer Support Cases</h2>

      {/* Search input for filtering */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by Order ID or Customer ID"
        className="p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
      />

      {/* Grid layout to display filtered cases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.length === 0 ? (
          <p>No active cases found</p>
        ) : (
          filteredCases.map((caseItem) => (
            <div
              key={`${caseItem.orderId}-${caseItem.senderId}`}
              className="p-4 border border-gray-300 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Order ID: {caseItem.orderId}</h3>
                  <p>Customer ID: {caseItem.senderId}</p>
                </div>

                {/* Toggle button for opening/closing the chat */}
                <button
                  onClick={() => toggleChatBox(caseItem.orderId, caseItem.senderId)}
                  className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  {openChats.has(`${caseItem.orderId}-${caseItem.senderId}`)
                    ? "Close Chat"
                    : "Open Chat"}
                </button>
              </div>

              {/* Render ChatBox for each active case if the chat is open */}
              {openChats.has(`${caseItem.orderId}-${caseItem.senderId}`) && (
                <SupportComponent
                  orderId={caseItem.orderId}
                  customerId={caseItem.senderId}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
