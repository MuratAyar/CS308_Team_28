// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../config/api";
import axios from "axios";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]); // Initialize orders as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found.");
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          apiUrl("/api/shop/order/allOrders"),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched orders:", response.data);

        // Extract the actual orders from the response
        const fetchedOrders = response.data?.data || [];
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(
        apiUrl(`/api/shop/order/update-order-status/${orderId}`),
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update the order status in the UI
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );

      } else {
        setError("Failed to update order status.");
      }
    } catch (err) {
      setError(`Error updating order status: ${err.message || "Unknown error"}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded shadow-md space-y-4 bg-white"
          >
            <div>
              <strong>Order ID:</strong> {order._id}
            </div>
            <div>
              <strong>User ID:</strong> {order.userId || "N/A"}
            </div>
            <div>
              <strong>Status:</strong> {order.orderStatus}
              <select
                value={order.orderStatus}
                onChange={(e) =>
                  handleStatusChange(order._id, e.target.value)
                }
                className="ml-2 border rounded p-1"
              >
                <option value="processing">Processing</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <strong>Order Date:</strong>{" "}
              {order.orderDate
                ? new Date(order.orderDate).toLocaleString()
                : "N/A"}
            </div>
            <div>
              <strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}
            </div>
            <div>
              <strong>Address Info:</strong>
              <ul className="ml-4 list-disc">
                <li>
                  <strong>Address:</strong> {order.addressInfo?.address || "N/A"}
                </li>
                <li>
                  <strong>City:</strong> {order.addressInfo?.city || "N/A"}
                </li>
                <li>
                  <strong>Pincode:</strong>{" "}
                  {order.addressInfo?.pincode || "N/A"}
                </li>
                <li>
                  <strong>Phone:</strong> {order.addressInfo?.phone || "N/A"}
                </li>
              </ul>
            </div>
            <div>
              <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
            </div>
            <div>
              <strong>Payment Status:</strong> {order.paymentStatus || "N/A"}
            </div>
            {order.cartItems?.length > 0 && (
              <div>
                <strong>Cart Items:</strong>
                <ul className="ml-4 list-disc">
                  {order.cartItems.map((item, index) => (
                    <li key={index}>
                      {item.name} - Quantity: {item.quantity}, Price: $
                      {item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-500">No orders available.</div>
      )}
    </div>
  );
};

export default ManageOrders;
