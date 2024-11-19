const Cart = require ("../../models/Cart");
const Product = require("../../models/Product");
const mongoose = require("mongoose");

const generateTemporaryUserId = () => {
    return `guest_${new mongoose.Types.ObjectId().toString()}`;
};

const addToCart = async (req, res) => {
    try {
        let { userId, productId, quantity } = req.body;

        if (!productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        if (!userId) {
            // Assign a unique ID for the guest user
            userId = generateTemporaryUserId();
        }

        // Find or create the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product is already in the cart
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

        if (itemIndex === -1) {
            cart.items.push({ productId, quantity: Number(quantity) });
        } else {
            cart.items[itemIndex].quantity += Number(quantity);
        }

        await cart.save();
        // Determine if it's a guest cart
        const isGuest = userId.startsWith("guest_");

        res.status(200).json({
            success: true,
            data: cart,
            guestId: isGuest ? userId : undefined, // Return guestId if applicable
            message: isGuest
                ? "Guest cart created or updated! Use the provided guestId for future operations."
                : "User cart updated successfully!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};


const fetchCartItems = async (req,res)=>{
    try{

        let {userId} = req.params;

        if (!userId) {
            // Create a guest cart if no userId is provided
            userId = generateTemporaryUserId();
        }

        const cart = await Cart.findOne({userId}).populate({
            path: "items.productId",
            select: "image title price salePrice",
        });

        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found!",
            });
        }

        const validItems = cart.items.filter(productItem => productItem.productId);

        if(validItems.length < cart.items.length){
            cart.items = validItems;
            await cart.save();
        }
        // Calculate total cost by summing up each item's (price or salePrice) * quantity
        const totalCost = validItems.reduce((total, item) => {
            const price = item.productId.salePrice || item.productId.price;
            return total + price * item.quantity;
        }, 0);

        const populateCartItems = validItems.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity,

        }));

        res.status(200).json({
            success: true,
            data:{
                ...cart._doc,
                items: populateCartItems,
                totalCost
            },
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};


const updateCartItemQty = async (req, res) => {
    try {
        let { userId, productId, quantity } = req.body;

        if (!productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        if (!userId) {
            // Assign a unique ID for the guest user
            userId = generateTemporaryUserId();
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!",
            });
        }

        const findCurrentProductIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (findCurrentProductIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Cart item not present!",
            });
        }

        cart.items[findCurrentProductIndex].quantity = Number(quantity);
        await cart.save();

        await cart.populate({
            path: "items.productId",
            select: "image title price salePrice",
        });

        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found!",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};


const deleteCartItem = async (req, res) => {
    try {
        let { userId, productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            });
        }

        if (!userId) {
            // Assign a unique ID for the guest user
            userId = generateTemporaryUserId();
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "image title price salePrice",
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId._id.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in the cart!",
            });
        }

        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();

        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            image: item.productId ? item.productId.image : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error",
        });
    }
};


module.exports = {
    addToCart,
    updateCartItemQty, deleteCartItem, fetchCartItems
}