import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const DeleteAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            console.log("Sending request to delete account with email and password:", { email, password });
            
            // Use the full URL for deleteUserAccount
            const response = await axios.delete('http://localhost:5000/api/auth/delete-account', {
                data: { email, password }
            });
            
            console.log("Response from server:", response);

            if (response.data.success) {
                // Redirect to the account deleted confirmation page
                navigate('/shop/account/account-deleted');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred while trying to delete the account.');
            console.error("Error during API call:", err);
        }
    };

    return (
        <form onSubmit={handleDelete} className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion with Email and Password</h2>
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full max-w-sm"
                required
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 w-full max-w-sm"
                required
            />
            <Button type="submit" variant="danger" className="w-full max-w-sm">
                Delete Account
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    );
};

export default DeleteAccount;
