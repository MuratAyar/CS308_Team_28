import axios from "axios";
import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import { apiUrl } from "../../../config/api";

const initialState = {
    cartItems: [],
    isLoading: false,
}

export const addToCart = createAsyncThunk("cart/addToCart", async({userId, productId, quantity})=>{

    const response = await axios.post(apiUrl("/api/shop/cart/add"),
        {
            userId,
            productId,
            quantity,
        }
    );
    return response.data;
}
);

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async(userId)=>{

    const response = await axios.get(apiUrl(`/api/shop/cart/get/${userId}`)
    );
    return response.data;
}
);

export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async({userId, productId})=>{

    const response = await axios.delete(apiUrl(`/api/shop/cart/${userId}/${productId}`)
    );
    return response.data;
}
);

export const updateCartItemQty = createAsyncThunk("cart/updateCartItemQty", async({userId, productId, quantity})=>{

    const response = await axios.put(apiUrl("/api/shop/cart/update-cart"),
        {
            userId,
            productId,
            quantity,
        }
    );
    return response.data;
}
);
const shopCartSlice = createSlice({
    name: "shopCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(addToCart.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            // Fetch Cart Items
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            // Update Cart Item Quantity
            .addCase(updateCartItemQty.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartItemQty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(updateCartItemQty.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            // Delete Cart Item
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            });
    },
});

export default shopCartSlice.reducer;