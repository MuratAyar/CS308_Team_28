import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [],
    isLoading: false,
    error: null,
};

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem("authToken"); // Get the token
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.data; // Ensure this matches your backend response
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch users");
    }
});


const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "An error occurred";
            });
    },
});

export default userSlice.reducer;
