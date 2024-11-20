import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems }) {
    // Calculate the total cart amount by iterating through each item in the cart
    const totalCartAmount =
        cartItems && cartItems.length > 0
            ? cartItems.reduce(
                (sum, currentItem) =>
                    sum +
                    (currentItem?.salePrice > 0
                        ? currentItem?.salePrice
                        : currentItem?.price) *
                    currentItem?.quantity,
                0
            )
            : 0;

    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {/* Render each cart item if available */}
                {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <UserCartItemsContent
                            key={item.productId}
                            cartItem={item}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">Your cart is empty.</p>
                )}
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
                </div>
            </div>
            <Button className="w-full mt-4">Checkout</Button>
        </SheetContent>
    );
}

export default UserCartWrapper;