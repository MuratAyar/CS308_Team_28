import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewOrder } from "../../store/shop/order-slice";

const OrderForm = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createNewOrder({ cardNumber, expiryDate }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength="16"
            />
            <input
                type="date"
                placeholder="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
            />
            <button type="submit">Place Order</button>
        </form>
    );
};

export default OrderForm;
