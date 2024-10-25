import { createSlice } from "@reduxjs/toolkit"; // Importing createSlice from Redux Toolkit

const initialState = {
    isAuthenticated: false, // User authentication status
    isLoading: false,       // Loading state for async operations
    user: null              // User data
};

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
    }
});

// Exporting the action creator for setUser
export const { setUser } = authSlice.actions;

// Exporting the reducer to be used in the store
export default authSlice.reducer;
