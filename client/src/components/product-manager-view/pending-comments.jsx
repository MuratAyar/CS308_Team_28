// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../config/api";
import axios from "axios";

const PendingComments = () => {
  const [comments, setComments] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPendingComments = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found.");
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(apiUrl("/api/products/pendingcomments"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response data:", response.data); // Log the response data
        setComments(response.data.data || []);
      } catch (err) {
        console.error("Error fetching pending comments:", err);
        setError(err.response?.data?.message || "Failed to fetch pending comments.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPendingComments();
  }, []);
  
  // Handle approval or rejection
  const handleApprovalChange = async (commentId, isApproved) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log(`Updating approval for ${commentId} to ${isApproved}`); // Debug action

      // Ensure `isApproved` is passed as a string "true" or "false"
      const approvalStatus = isApproved ? "true" : "false"; 

      await axios.put(
        apiUrl(`/api/products/${commentId}/update-approval`),
        { isApproved: approvalStatus }, // Send "true" or "false" as a string
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove the updated comment from the list
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      
      // Set success message based on approval or rejection
      setSuccessMessage(isApproved ? "Comment approved!" : "Comment rejected!");
      
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error("Error updating comment approval:", err);
      setError("Failed to update comment approval.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="text-green-500">{successMessage}</div> // Display success message
      )}
      {comments.length === 0 ? ( // Safely check length here
        <div className="text-gray-500">No pending comments available.</div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="flex flex-col p-4 border rounded shadow-md"
          >
            <div>
              <strong>User:</strong> {comment.user?.email || "Unknown User"}
            </div>
            <div>
              <strong>Product:</strong> {comment.productId?.name || "Unknown Product"}
            </div>
            <div>
              <strong>Comment:</strong> {comment.content}
            </div>
            <div className="mt-2 flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleApprovalChange(comment._id, true)}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleApprovalChange(comment._id, false)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingComments;
