import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import to navigate after order creation

function ShoppingCheckout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
  });
  const [addressInfo, setAddressInfo] = useState({}); // Assuming you collect address info
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Total cart amount calculation
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
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
      formattedExpiryDate = `20${year}-${month}-01`; // Using the first day of the month
    }

    const orderData = {
      userId: user.id || user._id, // Use the correct property for user ID
      cartItems: cartItems.items,
      addressInfo: addressInfo, // Assuming you've collected address info
      cardNumber: selectedPaymentMethod === "Card" ? cardDetails.cardNumber : "null",
      expiryDate: selectedPaymentMethod === "Card" ? formattedExpiryDate : "null",
      totalAmount: totalCartAmount,
      paymentMethod: selectedPaymentMethod,
    };

    try {
      // Send order request to the correct endpoint
      const response = await axios.post(
        "http://localhost:5000/api/shop/order/create",
        orderData
      );

      if (response.data.success) {
        // Redirect or show success message
        navigate(`/order-success/${response.data.orderId}`);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Error creating order.");
    }
  };

  // Return early if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <h1>Please log in to proceed with checkout</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        {/* Optional banner image */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address setAddressInfo={setAddressInfo} />
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
