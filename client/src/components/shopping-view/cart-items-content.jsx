import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem, guestId }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cartItems } = useSelector((state) => state.shopCart);

  const userId = user?.id || cartItems?.userId;

  const handleUpdateQuantity = async (getCartItem, typeOfAction) => {
    const getTotalStock = getCartItem?.quantityInStock;

    if (typeOfAction === "plus" && getCartItem.quantity + 1 > getTotalStock) {
      toast({
        title: `Only ${getTotalStock} items are available in stock.`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateCartItemQty({
        userId,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully!",
        });
      } else {
        toast({
          title: "Failed to update cart item. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleCartItemDelete = async (getCartItem) => {
    dispatch(
      deleteCartItem({ userId: userId, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <img
        src={`/product-images/${cartItem?.image || "default.png"}`}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.name}</h3>
        {/* Display Price and Sales Price */}
        <div className="flex items-center gap-2 mt-1">
          {cartItem?.salesPrice && cartItem?.salesPrice > 0 ? (
            <>
              <span className="line-through text-gray-500">${cartItem?.price}</span>
              <span className="text-red-500 font-semibold">
                ${cartItem?.salesPrice}
              </span>
            </>
          ) : (
            <span className="font-semibold">${cartItem?.price}</span>
          )}
        </div>
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        {/* Display Total Price for this Item */}
        <p className="font-semibold">
          $
          {(
            (cartItem?.salesPrice && cartItem?.salesPrice > 0
              ? cartItem?.salesPrice
              : cartItem?.price) * cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
