"use client";
import React, { useState, useEffect, useRef } from "react";

const SupportComponent: React.FC<{ orderId: string; customerId: string }> = ({ orderId, customerId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ senderId: string; receiverId: string; message: string; timestamp: string; }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch messages for the specific order
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/components/support/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, customerId }),
        });

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [orderId, customerId]);

  useEffect(() => {
    console.log("orderId", orderId);
    console.log("customerId", customerId);
  }, []);

  // Send a message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      senderId: customerId,
      receiverId: null, // Admin replies to customer, customer to admin
      orderId,
      message,
    };

    try {
      const response = await fetch("/components/support/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      

      setMessages((prevMessages) => [...prevMessages, data]); // Instantly update UI
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed top-6 right-0 w-[350px] h-[450px] bg-white shadow-lg rounded-lg border border-gray-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gray-200 text-black p-3 font-semibold rounded-t-lg text-center">Order Chat - #{orderId}</div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 font-bold">No messages yet</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex items-start mb-2 ${msg.senderId === customerId ? "justify-end" : "justify-start"}`}>
                <div>
                  <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === customerId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex p-2 border-t border-gray-300">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Send</button>
        </form>
      </div>
    </div>
  );
};

export default SupportComponent;
