import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; // Importing createSlice from Redux Toolkit
import { fromJSON } from "postcss";
import axios from "axios";

const initialState = {
    isAuthenticated: false, // User authentication status
    isLoading: false,       // Loading state for async operations
    user: null              // User data
};

export const registerUser = createAsyncThunk('/auth/register', 

    async(FormData) => {
        const response = await axios.post('http://localhost:5000/api/auth/register', FormData,{
            withCredential: true,
        });
        return response.data;
    }
);

export const loginUser = createAsyncThunk('/auth/login', 

    async(FormData) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', FormData,{
            withCredential: true,
        });
        return response.data;
    }
);

// Create a slice of the Redux store for authentication
const authSlice = createSlice({
    name: 'auth',            // Name of the slice
    initialState,           // Initial state defined above
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload; // Update the user state with the payload
            state.isAuthenticated = true; // Set authenticated status to true
        },
        // You can define more reducers here (e.g., for logging out)
        extraReducers: (builder) => {
            builder
            .addCase(registerUser, pending, (state) => {
                state.isLoading = true
            }).addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            }).addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            }).addCase(loginUser, pending, (state) => {
                state.isLoading = true
            }).addCase(loginUser.fulfilled, (state, action) => {
                console.log(action)
                state.isLoading = false;
                state.user = action.payload.success?action.payload.user
                :null;
                state.isAuthenticated = !action.payload.success ? false :
                true
            }).addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            })
        } 
    }
});

// Exporting the action creator for setUser
export const { setUser } = authSlice.actions;

// Exporting the reducer to be used in the store
export default authSlice.reducer;
