import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import shopAddressSlice from "./shop/address-slice";
import shopProductsSlice from "./shop/products-slice";
import shoppingOrderSlice from "./shop/order-slice";
import shoppingCartSlice from "./shop/cart-slice";
const store = configureStore({
    reducer:{
        auth : authReducer,
        shopAddress : shopAddressSlice,
        shopProducts: shopProductsSlice,
        shoppingOrder: shoppingOrderSlice,
        shoppingCart: shoppingCartSlice,
    }
})


export default store;