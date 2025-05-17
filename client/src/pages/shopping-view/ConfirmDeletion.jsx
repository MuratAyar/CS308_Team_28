import React, { useState } from 'react';
import { apiUrl } from "../../config/api";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';  // Adjusted path based on your setup
import { Input } from '../../components/ui/input';    // Adjusted path based on your setup

const ConfirmDeletion = () => {
    const [confirmationText, setConfirmationText] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            console.log("Sending request to backend with confirmation text:", confirmationText);
            
            // Update to match the full path
            const response = await axios.post('apiUrl("/api/auth/confirm-delete")', { confirmation: confirmationText });
            
            console.log("Response from backend:", response);
    
            if (response.data.success) {
                navigate('/shop/account/delete-account');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred while trying to confirm deletion.');
            console.error("Error occurred during API call:", err);
        }
    };
    

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-4">Type "delete" to confirm account deletion.</p>
            <Input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type 'delete' here"
                className="mb-4 w-full max-w-sm"
            />
            <Button type="submit" variant="danger" className="w-full max-w-sm">
                Confirm
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    );
};

export default ConfirmDeletion;
