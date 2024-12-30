// src/components/sales-manager-view/CalculateRevenueLoss.jsx

import React, { useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CalculateRevenueLoss = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Both 'Start Date' and 'End Date' are required.");
      return;
    }

    // Optional: Validate date range
    if (new Date(startDate) > new Date(endDate)) {
      setError("'Start Date' cannot be after 'End Date'.");
      return;
    }

    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // **Temporary Fix:** Hardcode the API base URL
      const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your actual API base URL

      console.log('Using API_BASE_URL:', API_BASE_URL);
      console.log('Authorization Token:', token);

      const response = await axios.get(
        `${API_BASE_URL}/shop/order/revenueAndLoss`,
        {
          params: {
            startDate,
            endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.data.success) {
        setData(response.data);
      } else {
        setError('Failed to fetch data.');
      }
    } catch (err) {
      console.error("Error fetching revenue and loss data:", err);
      if (err.response) {
        if (err.response.status === 403) {
          setError('You do not have permission to access this resource.');
        } else if (err.response.status === 401) {
          setError('Unauthorized. Please log in.');
        } else {
          setError(err.response.data.message || 'An error occurred while fetching data.');
        }
      } else if (err.request) {
        setError('No response received from the server.');
      } else {
        setError('Error setting up the request.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!data) return {};

    const revenueData = data.revenueBreakdown.map((item) => ({
      product: item.product,
      revenue: parseFloat(item.revenue),
    }));

    const lossData = data.lossBreakdown.map((item) => ({
      product: item.product,
      loss: parseFloat(item.loss),
    }));

    return { revenueData, lossData };
  };

  const { revenueData, lossData } = prepareChartData();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Calculate Revenue and Loss</h2>
      
      <form onSubmit={handleCalculate} className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="mb-1 font-medium">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="mb-1 font-medium">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className = "bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {data && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Summary</h3>
            <p>Total Revenue: <span className="font-medium">${data.totalRevenue}</span></p>
            <p>Total Loss: <span className="font-medium">${data.totalLoss}</span></p>
            <p>Number of Orders: <span className="font-medium">{data.ordersCount}</span></p>
            <p>Period: <span className="font-medium">{data.startDate} to {data.endDate}</span></p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Loss Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="loss" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Optional: Detailed Tables */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Revenue Breakdown Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Product</th>
                    <th className="px-4 py-2 border">Revenue ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.revenueBreakdown.map((item) => (
                    <tr key={item.product}>
                      <td className="px-4 py-2 border">{item.product}</td>
                      <td className="px-4 py-2 border">{item.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Loss Breakdown Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Product</th>
                    <th className="px-4 py-2 border">Loss ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lossBreakdown.map((item) => (
                    <tr key={item.product}>
                      <td className="px-4 py-2 border">{item.product}</td>
                      <td className="px-4 py-2 border">{item.loss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculateRevenueLoss;
