import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button'; // Update the path as needed
import { Card } from '@/components/ui/card';     // Update the path as needed

function OrderSuccess() {
  const { orderId } = useParams(); // Get the orderId from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch order details when component mounts
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/shop/order/details/${orderId}`,
          {
            withCredentials: true, // Include this if your backend requires authentication
          }
        );
        console.log("Response: ", response.data);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-5">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-5">
        Error fetching order details. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-5 mt-20"> {/* Added mt-20 to add margin at the top */}
      <Card className="max-w-3xl mx-auto p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Order Confirmation
        </h1>
        <p className="text-center mb-6">
          Thank you for your purchase! You can find the invoice in your email.
        </p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Order Details</h2>
          <div className="space-y-1">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Order Date:</strong>{' '}
              {new Date(order.orderDate).toLocaleString()}
            </p>
            <p>
              <strong>Total Amount:</strong> ${Number(order.totalAmount).toFixed(2)}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
          </div>
        </div>

        {order.addressInfo && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
            <div className="space-y-1">
              <p>{order.addressInfo.address}</p>
              <p>
                {order.addressInfo.city}, {order.addressInfo.pincode}
              </p>
              <p>
                <strong>Phone:</strong> {order.addressInfo.phone}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Ordered Items</h3>
          <ul className="space-y-4">
            {order.cartItems && order.cartItems.length > 0 ? (
              order.cartItems.map((item, index) => {
                // Convert price to a number
                const priceValue = parseFloat(item.price);
                const displayPrice = !isNaN(priceValue)
                  ? `$${priceValue.toFixed(2)}`
                  : 'Price not available';

                return (
                  <li key={index} className="flex items-center">
                    {item.image && (
                      <img
                        src={`/product-images/${item.image}`}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{displayPrice} each</p>
                  </li>
                );
              })
            ) : (
              <p>No items in this order.</p>
            )}
          </ul>
        </div>

        <div className="text-center">
          <Button onClick={() => window.location.href = '/shop/home'}>
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default OrderSuccess;
