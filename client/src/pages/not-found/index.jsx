import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('auth/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 to-blue-200 text-gray-800">
            <div className="text-center max-w-md p-6 rounded-lg shadow-lg bg-white bg-opacity-80">
                <h1 className="text-8xl font-bold mb-4">404</h1>
                <p className="text-2xl font-semibold mb-2">We couldn’t find the page you’re looking for</p>
                <p className="text-lg mb-6">It seems the page you're looking for doesn’t exist.</p>
                <button
                    onClick={handleNavigate} // Use onClick instead of onclick
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                    Return to Homepage
                </button>
            </div>
        </div>
    );
}

export default NotFound;
