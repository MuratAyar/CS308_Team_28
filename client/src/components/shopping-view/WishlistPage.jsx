import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistItems,
  removeWishlistItem,
} from "@/store/shop/wishlist-slice";
import { Button } from "../ui/button";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistItems, isLoading } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth); // Access user state from auth

  useEffect(() => {
    if (!user) {
      navigate("/auth/login"); // Redirect to login if not authenticated
    } else {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, user, navigate]);

  const handleRemove = (productId) => {
    dispatch(removeWishlistItem(productId)) // Remove item from wishlist
      .unwrap()
      .then(() => {
        alert("Item removed from wishlist.");
      })
      .catch((error) => {
        console.error("Remove from wishlist failed:", error);
        alert("Failed to remove item from wishlist.");
      });
  };

  if (isLoading) return <div>Loading your wishlist...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Wishlist</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 border border-gray-300">Product Name</th>
            <th className="p-4 border border-gray-300">Unit Price</th>
            <th className="p-4 border border-gray-300">Stock Status</th>
            <th className="p-4 border border-gray-300">Added On</th>
            <th className="p-4 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <tr key={item.productId._id}>
                <td className="p-4 border border-gray-300">{item.productId.name}</td>
                <td className="p-4 border border-gray-300">
                  {item.productId.salesPrice ? (
                    <>
                      <span className="line-through">${item.productId.price}</span>{" "}
                      <span className="text-red-500">${item.productId.salesPrice}</span>
                    </>
                  ) : (
                    `$${item.productId.price}`
                  )}
                </td>
                <td className="p-4 border border-gray-300">
                  {item.productId.quantityInStock > 0 ? "In Stock" : "Out of Stock"}
                </td>
                <td className="p-4 border border-gray-300">
                  {new Date(item.addedOn).toLocaleDateString()}
                </td>
                <td className="p-4 border border-gray-300 text-center">
                  <Button
                    onClick={() => handleRemove(item.productId._id)} // Call remove function
                    variant="outline"
                    className="bg-black text-white px-2 py-1 rounded"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center p-4 border border-gray-300 text-gray-500"
              >
                Your wishlist is empty!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WishlistPage;
