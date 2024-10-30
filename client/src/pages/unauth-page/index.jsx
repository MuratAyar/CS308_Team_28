import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnAuthPage = () => {
    const navigate = useNavigate(); // Use useNavigate to handle navigation

    const handleGoHome = () => {
        navigate('/auth/login'); // Navigate to the homepage
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-200 to-yellow-200 text-gray-800">
            <div className="text-center max-w-md p-6 rounded-lg shadow-lg bg-white bg-opacity-90">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-4xl font-bold mb-2">Oops! You don’t have access to this page</h1>
                <p className="text-lg mb-4">Please make sure you have the necessary permissions.</p>
                <button 
                    onClick={handleGoHome} 
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                    Return to Homepage
                </button>
            </div>
        </div>
    );
};

export default UnAuthPage;

//Check-auth Salıp bunu yapabiliriz
