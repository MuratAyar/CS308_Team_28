const Wishlist = require("../../models/Wishlist");

// Add product to wishlist
const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Invalid data!" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const productExists = wishlist.items.some(
      (item) => item.productId.toString() === productId
    );

    if (productExists) {
      return res.status(400).json({ message: "Product already in wishlist." });
    }

    wishlist.items.push({ productId });
    await wishlist.save();

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json({ success: true, message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch wishlist items
const fetchWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price salesPrice image quantityInStock",
    });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    const wishlistItems = wishlist.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      salesPrice: item.productId.salesPrice,
      image: item.productId.image,
      stockStatus: item.productId.quantityInStock > 0 ? "In Stock" : "Out of Stock",
      addedOn: item.addedOn,
    }));

    res.status(200).json({ success: true, data: wishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addToWishlist, removeFromWishlist, fetchWishlist };
