import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageSearchOrders = () => {
  const [orders, setOrders] = useState([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userIdInput, setUserIdInput] = useState(""); // Input for userId filter

  const fetchOrdersByUserId = async (userId) => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    // Check if token is present
    if (!token) {
      console.error("No token found.");
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching orders for userId:", userId);
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/list/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Log the response for debugging
      console.log("Fetched orders response:", response.data);

      const fetchedOrders = response.data?.data || [];
      if (fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders); // Initially show filtered orders
      } else {
        setFilteredOrders([]); // No orders found for the given userId
        setError("No orders found for this User ID.");
      }
    } catch (err) {
      console.error("Error fetching orders by userId:", err);
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (userIdInput.trim()) {
      fetchOrdersByUserId(userIdInput.trim());
    } else {
      setOrders([]); // No userId provided
      setFilteredOrders([]);
    }
  };

  const handleInputChange = (event) => {
    setUserIdInput(event.target.value);
  };

 

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Input for filtering by User ID */}
      <div className="mb-4">
        <input
          type="text"
          value={userIdInput}
          onChange={handleInputChange}
          placeholder="Enter User ID to filter"
          className="border p-2 rounded"
        />
        <button
          onClick={handleFilter}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Filter
        </button>
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
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
        <div className="text-gray-500">No orders found for this User ID.</div>
      )}
    </div>
  );
};

export default ManageSearchOrders;
