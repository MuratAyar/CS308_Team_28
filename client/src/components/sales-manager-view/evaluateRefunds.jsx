// src/components/sales-manager-view/EvaluateRefunds.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card';
import { apiUrl } from '../../config/api';

const EvaluateRefunds = () => {
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Access the authentication token from localStorage
  const token = localStorage.getItem("authToken");

  // Backend API base URLs
  const GET_ENDPOINT = apiUrl("/api/shop/order/waiting-refunds");
  const PUT_ENDPOINT = apiUrl("/api/shop/order/evaluate-refund");

  // Fetch orders with 'waiting-for-refund' status on component mount
  useEffect(() => {
    const fetchWaitingRefunds = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get(GET_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.data);
      } catch (err) {
        console.error("Error fetching waiting refunds:", err);
        setFetchError(
          err.response?.data?.message ||
            "Failed to fetch waiting refunds. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWaitingRefunds();
  }, [GET_ENDPOINT, token]);

  // Function to approve a refund
  const approveRefund = async (orderId) => {
    // Reset previous messages
    setActionError(null);
    setSuccessMessage(null);

    // Confirm before approving
    const confirmApproval = window.confirm(
      "Are you sure you want to approve this refund?"
    );
    if (!confirmApproval) return;

    try {
      // Send approval request
      const response = await axios.put(
        PUT_ENDPOINT,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the orders state by removing the approved order
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      // Set success message
      setSuccessMessage("Refund approved successfully!");
    } catch (err) {
      console.error("Error approving refund:", err);
      setActionError(
        err.response?.data?.message ||
          "Failed to approve refund. Please try again later."
      );
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-semibold text-center">
        Evaluate Waiting Refunds
      </h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Action Error Message */}
      {actionError && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {actionError}
        </div>
      )}

      {/* Fetch Error Message */}
      {fetchError && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {fetchError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2">Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-4 text-center text-gray-700">
          No orders are currently waiting for a refund.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b">Order ID</th>
                <th className="px-4 py-2 border-b">User</th>
                <th className="px-4 py-2 border-b">Items</th>
                <th className="px-4 py-2 border-b">Total Amount</th>
                <th className="px-4 py-2 border-b">Order Date</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {order._id}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {/* Assuming userId is populated with user details */}
                    {order.userId.name} <br />
                    <span className="text-xs text-gray-500">
                      {order.userId.email}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    <ul className="list-disc list-inside">
                      {order.cartItems.map((item) => (
                        <li key={item._id}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-4 py-2 border-b text-sm text-gray-700">
                    <button
                      onClick={() => approveRefund(order._id)}
                      className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <CheckCircle className="h-5 w-5 mr-1" />
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EvaluateRefunds;
