import React, { useState, useEffect } from "react";
import axios from "axios";

const ClientsTab = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders/orders"
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(newStatus);

    try {
      await axios.put(`http://localhost:5000/api/orders/update/${orderId}`, {
        providerStatus: newStatus,
      });

      // Update local state to reflect the new status
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, providerStatus: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const renderStatusButton = (order) => {
    switch (order.providerStatus) {
      case "pending":
        return (
          <button
            onClick={() => updateOrderStatus(order._id, "received")}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg  transition-colors"
          >
            Received
          </button>
        );

      case "received":
        return (
          <button
            onClick={() => updateOrderStatus(order._id, "preparing")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Preparing
          </button>
        );

      case "preparing":
        return (
          <button
            onClick={() => updateOrderStatus(order._id, "ready")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Ready
          </button>
        );

      case "ready":
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Clients Orders
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-xl p-6 transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {order.firstName} {order.lastName}
              </h2>
              <p className="text-gray-600 mb-2">{order.email}</p>
            </div>

            <div className="border-t border-b py-4 mb-4">
              <h3 className="font-bold mb-2">Order Items:</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-700">
                  <span>
                    Product {item.product ? item.product._id : "Custom Item"}
                  </span>
                  <span>
                    Quantity: {item.quantity} | Price: ${item.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`
                px-3 py-1 rounded-full text-sm font-semibold
                ${
                  order.providerStatus === "pending"
                    ? "bg-blue-100 text-blue-800"
                    : order.providerStatus === "received"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.providerStatus === "preparing"
                    ? "bg-green-100 text-green-800"
                    : order.providerStatus === "ready"
                    ? "bg-purple-100 text-purple-800"
                    : ""
                }
              `}
              >
                {order.providerStatus.toUpperCase()}
              </span>

              {renderStatusButton(order)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsTab;
