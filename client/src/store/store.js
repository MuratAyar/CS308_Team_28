import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import shopAddressSlice from "./shop/address-slice";
import shopProductsSlice from "./shop/products-slice";
import shopOrderSlice from "./shop/order-slice";
import shopCartSlice from "./shop/cart-slice";
const store = configureStore({
    reducer:{
        auth : authReducer,
        shopAddress : shopAddressSlice,
        shopProducts: shopProductsSlice,
        shopOrder: shopOrderSlice,
        shopCart: shopCartSlice,
    }
})


export default store;