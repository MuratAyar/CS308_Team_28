import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import shopAddressSlice from "./shop/address-slice";
const store = configureStore({
    reducer:{
        auth : authReducer,
        shopAddress : shopAddressSlice
    }
})


export default store;