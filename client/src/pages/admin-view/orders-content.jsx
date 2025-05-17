import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config/api";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found.");
        setError("Authentication required. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          apiUrl("/api/shop/order/allOrders"),
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedOrders = response.data?.data || [];
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to fetch orders.");
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center">All Orders</h2>

      {/* Error Message */}
      {error ? (
        <p className="text-red-500 text-center mb-6">{error}</p>
      ) : null}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <p className="font-semibold mb-2">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="mb-1">
                <strong>User ID:</strong> {order.userId || "N/A"}
              </p>
              <p className="mb-1">
                <strong>Order Date:</strong>{" "}
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleString()
                  : "N/A"}
              </p>
              <p className="mb-1">
                <strong>Payment Status:</strong> {order.paymentStatus}
              </p>
              <p className="mb-1">
                <strong>Order Status:</strong>{" "}
                <span
                  className={`${
                    order.orderStatus === "delivered"
                      ? "text-green-500"
                      : "text-yellow-500"
                  } font-semibold`}
                >
                  {order.orderStatus}
                </span>
              </p>
              <p>
                <strong>Total Amount:</strong> ${order.totalAmount}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
