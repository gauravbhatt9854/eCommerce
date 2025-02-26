"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../provider/SocketProvider";
import { useAppState } from "../../provider/AppStateProvider";
type Message = {
  username: string;
  message: string;
  timestamp: number;
  profileUrl: string;
};

const Chat: React.FC = () => {
  const { socket } = useSocket();
  const {user , isChat} = useAppState();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Ref for scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Listen for new messages
  useEffect(() => {
    if (!socket) {
      console.log("No socket connection");
      return;
    }

    const handleNewMessage = (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("newChatMessage", handleNewMessage);

    return () => {
      socket.off("newChatMessage", handleNewMessage);
    };
  }, [socket]); // Removed useCallback dependency issue

  // Send a new message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && message.trim()) {
      socket.emit("chatMessage", message);
      const selfMsg: Message = {
        username: user?.fullName || "Anonymous",
        message,
        timestamp: Date.now(),
        profileUrl: user?.profileUrl || "",
      };
      // console.log("Sent message:", selfMsg); // Debug log
      setMessages((prevMessages) => [...prevMessages, selfMsg]);
      setMessage("");
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className={`fixed bottom-6 right-6 w-[300px] h-[400px] bg-white shadow-lg rounded-lg border border-gray-300 z-50
        ${isChat && user ? "block" : "hidden"}`}
      //  
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
          {messages.length === 0 && (
            <div className="text-center text-gray-500 font-bold">
              START A CONVERSATION
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start mb-2 ${
                msg.username === user?.fullName ? "justify-end" : "justify-start"
              }`}
            >
              {msg.username !== user?.fullName && (
                <img
                  src={msg.profileUrl}
                  alt={msg.username}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div>
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.username === user?.fullName
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.username} • {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {/* Scroll to the latest message */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={sendMessage} className="flex p-2 border-t border-gray-300">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
