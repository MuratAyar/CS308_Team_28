// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import { apiUrl } from "../../config/api";
import { useSelector } from "react-redux";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import to navigate after order creation
import { deleteCartItem } from "@/store/shop/cart-slice";
import { useDispatch } from 'react-redux';

function ShoppingCheckout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
  });
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(currentSelectedAddress, "cartItems");

  // Total cart amount calculation
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salesPrice > 0
              ? currentItem?.salesPrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Handle payment method change
  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  // Handle card number input change
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters

    if (value.length > 16) {
      value = value.slice(0, 16); // Limit to 16 digits
    }

    setCardDetails((prev) => ({
      ...prev,
      cardNumber: value,
    }));
  };

  // Handle expiry date input change
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters

    if (value.length > 4) {
      value = value.slice(0, 4); // Limit to 4 digits
    }

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`; // Add "/" after first two digits
    }

    setCardDetails((prev) => ({
      ...prev,
      expiryDate: value,
    }));
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const deleteAllCartItems = async (orderData) => {
    try {
      // Check if cartItems is available
      if (!orderData || !Array.isArray(orderData.cartItems)) {
        throw new Error("No cart items to delete or invalid data structure");
      }
  
      // Loop through the cart items and delete them one by one
      for (const item of orderData.cartItems) {
        try {
          await dispatch(deleteCartItem({ userId: orderData.userId, productId: item.productId }));
          console.log(`Item ${item.productId} deleted successfully`);
  
          // Wait for 1-2 seconds before proceeding to the next request
          await delay(1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        } catch (error) {
          console.error(`Error deleting item ${item.productId}:`, error);
        }
      }
  
      console.log("All items processed for deletion");
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  };
  

  // Handle form submission
  const handleSubmit = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      return setError("You must be logged in to complete the purchase.");
    }

    if (selectedPaymentMethod === "Card") {
      // Validate card details
      if (!cardDetails.cardNumber || !cardDetails.expiryDate) {
        setError("Please fill in the credit card details.");
        return;
      }

      // Validate expiry date format MM/YY
      const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryDateRegex.test(cardDetails.expiryDate)) {
        setError("Invalid expiry date format. Use MM/YY.");
        return;
      }
    }

    // Convert MM/YY to YYYY-MM-DD
    let formattedExpiryDate = null;
    if (selectedPaymentMethod === "Card") {
      const [month, year] = cardDetails.expiryDate.split("/");
      // Create a date in the future with the given month and year
      const expiryDate = new Date();
      expiryDate.setFullYear(2000 + parseInt(year), parseInt(month) - 1, 1);
      // Add one month to ensure it's valid (e.g., if this month is selected, it would be valid until end of month)
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      formattedExpiryDate = expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    // Validate address is selected
    if (!currentSelectedAddress) {
      setError("Please select a shipping address.");
      return;
    }

    // Check if cart is empty
    if (!cartItems.items || cartItems.items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    const orderData = {
      userId: user.id || user._id, // Use the correct property for user ID
      cartItems: cartItems.items,
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes || "",
      },
      cardNumber: selectedPaymentMethod === "Card" ? cardDetails.cardNumber : "null",
      expiryDate: selectedPaymentMethod === "Card" ? formattedExpiryDate : "null",
      totalAmount: totalCartAmount,
      paymentMethod: selectedPaymentMethod,
    };

    try {
      // Log the order data being sent
      console.log("Sending order data:", orderData);
      
      // Send order request to the correct endpoint
      const response = await axios.post(
        apiUrl("/api/shop/order/create"),
        orderData
      );

      if (response.data.success) {
        deleteAllCartItems(orderData);
        // Redirect or show success message
        navigate(`/shop/order-success/${response.data.orderId}`);
      } else {
        console.error("Order creation failed with response:", response.data);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Show more detailed error message from the response if available
      if (error.response) {
        console.error("Server response:", error.response.data);
        setError(error.response.data.message || "Error creating order.");
      } else {
        setError("Error creating order. Please try again.");
      }
    }
  };

  console.log(isAuthenticated)

  // Return early if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Please log in to proceed with checkout
          </h1>
          <p className="text-gray-500 mb-6">You need to log in first to continue your purchase.</p>
          <Button 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => navigate('/auth/login')} // Assuming you have a login page route
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden mt-4">
      <img
        src="/checkout-image/28.png" 
        alt="Checkout Banner"
        className="w-full h-full object-contain"
      />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent key={item.id} cartItem={item} />
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment method selection */}
          <div>
            <label htmlFor="payment-method">Payment Method</label>
            <select
              id="payment-method"
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <option value="Card">Pay with Credit Card</option>
              <option value="Cash">Cash on Delivery</option>
            </select>
          </div>

          {/* Credit card details form */}
          {selectedPaymentMethod === "Card" && (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                maxLength="16"
                className="p-2 border"
              />
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleExpiryDateChange}
                maxLength="5"
                className="p-2 border"
              />
            </div>
          )}

          {/* Error message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Checkout button */}
          <div className="mt-4 w-full">
            <Button className="w-full" onClick={handleSubmit}>
              {selectedPaymentMethod === "Card"
                ? "Pay with Credit Card"
                : "Pay with Cash on Delivery"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
