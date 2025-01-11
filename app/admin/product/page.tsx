"use client"
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
  });
  const user = useAuth();
  console.log(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,

    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The async function inside the event handler
    const response = await fetch('/admin/addProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert('Product created successfully');
      setProduct({ name: '', description: '', price: 0 }); // Reset the form after submission
    } else {
      alert('Failed to create product');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter product description"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Product Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter product price"
            required
            min="0"
            step="0.01"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
