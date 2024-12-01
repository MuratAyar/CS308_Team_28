import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch pending comments from API
    const fetchComments = async () => {
      try {
        const res = await axios.get('/api/comments/pending');
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, []);

  const handleApprove = async (commentId) => {
    try {
      await axios.put(`/api/comments/${commentId}/update-approval`, {
        isApproved: 'true',
      });
      // Refresh the list or remove the approved comment
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error('Error approving comment:', err);
    }
  };

  const handleReject = async (commentId) => {
    try {
      await axios.put(`/api/comments/${commentId}/update-approval`, {
        isApproved: 'false',
      });
      // Refresh the list or remove the rejected comment
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error('Error rejecting comment:', err);
    }
  };

  return (
    <div className="manage-comments">
      <h2>Manage Pending Comments</h2>
      {comments.length === 0 ? (
        <p>No pending comments</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment.content}</p>
            <button onClick={() => handleApprove(comment._id)}>Approve</button>
            <button onClick={() => handleReject(comment._id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageComments;
