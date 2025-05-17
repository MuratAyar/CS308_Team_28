import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "../../../config/api";

const initialState = {
  wishlistItems: [], // Stores the wishlist items
  isLoading: false, // Tracks loading state
};

// **Fetch Wishlist Items**
export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchWishlistItems",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(apiUrl("/api/wishlist/get"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// **Remove Item from Wishlist**
export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeWishlistItem",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(apiUrl(`/api/wishlist/remove/${productId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return productId; // Return the productId to update the state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// **Add to Cart (From Wishlist)**
export const addWishlistItemToCart = createAsyncThunk(
  "wishlist/addWishlistItemToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        apiUrl("/api/cart/add"),
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist Items
      .addCase(fetchWishlistItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload.data; // Set fetched data
      })
      .addCase(fetchWishlistItems.rejected, (state) => {
        state.isLoading = false;
        state.wishlistItems = []; // Reset on failure
      })
      // Remove Item from Wishlist
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item.productId._id !== action.payload
        ); // Remove item locally
      })
      // Add to Cart (From Wishlist)
      .addCase(addWishlistItemToCart.fulfilled, (state) => {
        console.log("Product added to cart successfully!");
      });
  },
});

export default wishlistSlice.reducer;
