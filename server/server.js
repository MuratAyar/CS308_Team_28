const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require("./routes/auth-routes");
const dotenv = require("dotenv");
const productRoutes = require('./routes/product-routes');
const path = require('path');
const shopAddressRouter = require("./routes/shop/address-route")


require('dotenv').config();

//create a database connection
//create a seperate file for this and import that file here
mongoose
    .connect('mongodb+srv://mertsaglam349:Mert2003@mern.pmbfe.mongodb.net/')
    .then(() => console.log('Connected'))
    .catch(() => console.log('Cannot connect to the database!')
)

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
app.use('/api/products', productRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/shop/address", shopAddressRouter)

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));