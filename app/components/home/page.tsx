"use client";
import ChatComponent from "../globalChat/page";

const HomePage = () => {
  const handleStartShopping = () => {
    // Redirect to the products page or any other shopping page
    window.location.href = "/components/products";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative">
            <ChatComponent />
      <div className="text-center p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to ShopEase
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your one-stop destination for all your shopping needs. Let's get
          started!
        </p>
        <button
          onClick={handleStartShopping}
          className="px-6 py-3 bg-indigo-600 text-white text-xl font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default HomePage;
