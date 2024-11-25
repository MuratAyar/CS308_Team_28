import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import shopAddressSlice from "./shop/address-slice";
import shopProductsSlice from "./shop/products-slice";
import shoppingOrderSlice from "./shop/order-slice";
import shopCartSlice from "./shop/cart-slice";
const store = configureStore({
    reducer:{
        auth : authReducer,
        shopAddress : shopAddressSlice,
        shopProducts: shopProductsSlice,
        shoppingOrder: shoppingOrderSlice,
        shopCart: shopCartSlice,
    }
})


export default store;