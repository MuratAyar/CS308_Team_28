import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, updateUserRole } from "../../store/user-slice"; // Adjust the path based on your project structure
import axios from "axios";
import "./Users.css"; // Add a CSS file for styling
import { apiUrl } from "../../config/api";

const Users = () => {
    const dispatch = useDispatch();
    const { users, isLoading, error } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers()); // Fetch users when the component mounts
    }, [dispatch]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            // Make the API call to update the role
            const token = localStorage.getItem("authToken"); // Retrieve token for authentication
            const response = await axios.put(
                apiUrl(`/api/users/${userId}/role`),
                { role: newRole },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                console.log("Role updated successfully:", response.data.data);
                // Dispatch an action to update the role in the Redux store
                dispatch(updateUserRole({ userId, newRole }));
            } else {
                console.error("Failed to update role:", response.data.message);
                alert("Failed to update role.");
            }
        } catch (err) {
            console.error("Error updating role:", err);
            alert("An error occurred while updating the role.");
        }
    };

    if (isLoading)
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );

    if (error)
        return <p className="error-message">Error: {error}</p>;

    return (
        <div className="admin-dashboard">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="role-select"
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(user._id, e.target.value)
                                            }
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="product">
                                                Product Manager
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
