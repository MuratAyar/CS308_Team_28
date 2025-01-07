const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require("./routes/auth-routes");
const dotenv = require("dotenv");
const productRoutes = require('./routes/product-routes');
const path = require('path');
const shopAddressRouter = require("./routes/shop/address-route")
// const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const userRoutes = require('./routes/user-routes');
const invoiceRoutes = require('./routes/invoice-routes');
const wishlistRoutes = require("./routes/shop/wishlist-routes");

require('dotenv').config();

//create a database connection
//create a seperate file for this and import that file here
if (process.env.NODE_ENV !== 'test') {
    mongoose
      .connect('mongodb+srv://mertsaglam349:Mert2003@mern.pmbfe.mongodb.net/')
      .then(() => console.log('Connected to DB'))
      .catch((err) => console.error('Cannot connect to DB:', err));
  }
/*
mongoose
    .connect('mongodb+srv://mertsaglam349:Mert2003@mern.pmbfe.mongodb.net/')
    .then(() => console.log('Connected'))
    .catch(() => console.log('Cannot connect to the database!')
)
    */

const app = express()
const PORT = process.env.PORT || 5000


app.use(
    cors({
        origin: 'http://localhost:5173',
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders :["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
        credentials : true
    })
)

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api', userRoutes);
app.use('/api/products', productRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/shop/address", shopAddressRouter)
app.use('/api/shop/products', productRoutes);
app.use('/api/shop/cart', shopCartRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use('/api/products', productRoutes);
app.use('/api', invoiceRoutes);
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use("/api/wishlist", wishlistRoutes);

module.exports = app;
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));