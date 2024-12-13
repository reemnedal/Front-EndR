import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/Layout/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items whالen component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/user/cart", {
        withCredentials: true,
      });

      setCartItems(response.data.items || []);
      calculateTotal(response.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Unable to fetch cart items");
      setLoading(false);
    }
  };

  // Calculate total price
  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // Update quantity of an item
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await deleteItem(productId);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/cart/update-quantity",
        {
          productId,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      // Update local state
      const updatedItems = cartItems.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    }
  };

  // Delete item from cart
  const deleteItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/cart/remove/${productId}`,
        { withCredentials: true }
      );

      // Remove item from local state
      const updatedItems = cartItems.filter(
        (item) => item.product._id !== productId
      );

      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to remove item from cart");
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-2xl text-gray-600 animate-pulse">
          جار التحميل...
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-red-600 text-center p-8 bg-white shadow-lg rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  // Render empty cart
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center p-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-3xl font-light text-gray-600">سلة التسوق فارغة</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold text-gray-800 text-center">
              سلة التسوق
            </h1>
          </div>

          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Product Image */}
                <img
                  src={item.product.mainImage}
                  alt={item.product.titleAr}
                  className="w-28 h-28 object-cover rounded-xl shadow-md ml-6"
                />

                {/* Product Details */}
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {item.product.titleAr}
                  </h2>
                  <p className="text-gray-500 text-lg">{item.price} دينار</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4 bg-gray-100 rounded-full px-4 py-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Minus size={24} />
                  </button>

                  <span className="text-xl font-semibold text-gray-800 w-8 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                {/* Total Item Price */}
                <div className="text-xl font-bold text-gray-800 mx-6">
                  {item.price * item.quantity} دينار
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteItem(item.product._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={28} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-100 p-8">
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-gray-700">
                  المجموع الكلي
                </span>
                <span className="text-3xl font-extrabold text-gray-900">
                  {totalPrice} دينار
                </span>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-purple-600 text-white py-4 rounded-xl
                            hover:bg-purple-700 transition-colors duration-300 
                            shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-xl font-bold">المتابعة للدفع</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
