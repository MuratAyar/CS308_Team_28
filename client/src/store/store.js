import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import shopAddressSlice from "./shop/address-slice";
import shopProductsSlice from "./shop/products-slice"
//import shopCartSlice from "./shop/cart-slice";
const store = configureStore({
    reducer:{
        auth : authReducer,
        shopAddress : shopAddressSlice,
        shopProducts: shopProductsSlice,
        //shopCart: shopCartSlice,
    }
})


export default store;