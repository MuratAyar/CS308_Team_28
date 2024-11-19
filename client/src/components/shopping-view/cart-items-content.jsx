import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

function UserCartItemsContent({ cartItem }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { toast } = useToast();

    const [guestId, setGuestId] = useState(localStorage.getItem("guestId"));
    const userId = user?.id || guestId;

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) {
                const response = await dispatch(fetchCartItems("unknown_user"));
                if (response?.payload?.guestId) {
                    setGuestId(response.payload.guestId);
                    localStorage.setItem("guestId", response.payload.guestId);
                }
            } else {
                dispatch(fetchCartItems(userId));
            }
        };

        fetchCart();
    }, [dispatch, userId]);

    const handleUpdateQuantity = (getCartItem, typeOfAction) => {
        const updatedQuantity =
            typeOfAction === "plus" ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1;

        if (updatedQuantity <= 0) {
            handleCartItemDelete(getCartItem);
            return;
        }

        dispatch(
            updateCartItemQty({
                userId,
                productId: getCartItem?.productId,
                quantity: updatedQuantity,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                toast({ title: "Cart item updated successfully" });
                dispatch(fetchCartItems(userId));
            }
        });
    };

    const handleCartItemDelete = (getCartItem) => {
        dispatch(
            deleteCartItem({ userId, productId: getCartItem?.productId })
        ).then((data) => {
            if (data?.payload?.success) {
                toast({ title: "Cart item deleted successfully" });
                dispatch(fetchCartItems(userId));
            }
        });
    };

    return (
        <div className="flex items-center space-x-4 py-4 border-b">
            <img
                src={`/product-images/${cartItem?.image}`}
                alt={cartItem?.title || "Product Image"}
                className="w-20 h-20 rounded object-cover"
            />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem?.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        size="icon"
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
                <p className="font-semibold">
                    $
                    {(
                        (cartItem?.salePrice || cartItem?.price) * cartItem?.quantity
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
