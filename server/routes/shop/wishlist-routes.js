const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} = require("../../controllers/shop/wishlist-controller");
const { authenticateToken } = require("../../middleware/index");

const router = express.Router();

router.post("/add", authenticateToken, addToWishlist);
router.delete("/remove/:productId", authenticateToken, removeFromWishlist);
router.get("/get", authenticateToken, fetchWishlist);

module.exports = router;
