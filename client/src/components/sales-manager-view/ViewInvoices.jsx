import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card'; // Use CardContent instead of CardBody
import { Label } from '../ui/label';
import { apiUrl, API_BASE_URL } from '../../config/api';

function ViewInvoices() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [invoices, setInvoices] = useState([]);

    const fetchInvoices = async () => {
        try {
            const response = await fetch(
                apiUrl(`/invoices?startDate=${startDate}&endDate=${endDate}`) // Replace with your backend URL
            );
            if (!response.ok) throw new Error('Failed to fetch invoices');
            const data = await response.json();
            setInvoices(data.invoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const downloadInvoice = async (invoiceName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/invoices/${invoiceName}`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error('Failed to download the invoice');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
    
            // Create a temporary <a> element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = invoiceName;
            document.body.appendChild(link);
            link.click();
    
            // Clean up the temporary URL
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the invoice:', error);
        }
    };
    
    const openInvoiceInNewTab = (invoiceName) => {
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}/invoices/${invoiceName}`;
        link.target = '_blank'; // Opens in a new tab
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <div className="container mx-auto p-4">
            <Card className="shadow-lg border rounded-lg">
                <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-700">
                        View and Download Invoices
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4"> {/* Corrected to CardContent */}
                    <div className="flex space-x-4">
                        <div>
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end-date">End Date</Label>
                            <Input
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={fetchInvoices}>Search</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {invoices.length > 0 ? (
                            invoices.map((invoice, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow-sm"
                                >
                                    <span className="text-gray-700">{invoice}</span>
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => downloadInvoice(invoice)}
                                            className="bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            Download
                                        </Button>
                                        <Button
                                            onClick={() => openInvoiceInNewTab(invoice)}
                                            className="bg-gray-500 text-white hover:bg-gray-600"
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                No invoices found for the selected date range.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ViewInvoices;
