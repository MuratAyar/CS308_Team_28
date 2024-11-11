import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import shopAddressSlice from "./shop/address-slice";
import shopProductsSlice from "./shop/products-slice"

const store = configureStore({
    reducer:{
        auth : authReducer,
        shopAddress : shopAddressSlice,
        shopProducts: shopProductsSlice
    }
})


export default store;