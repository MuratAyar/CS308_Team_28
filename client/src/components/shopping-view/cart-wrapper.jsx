import {Button} from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({cartItems}) {
    

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
        <div className="mt-8 space">
            {
                cartItems && cartItems.length > 0 ?
                cartItems.map(item=> <UserCartItemsContent cartItem={item}/>) : null
            }

        </div>
        <div className="mt-8 space-y-4">
            <div className="flex justify-between">
                <span className="font-bold">{totalCartAmount}</span>
            </div>
        </div>
        <Button className="w-full mt">Checkout</Button>
    </SheetContent>
    );
}

export default UserCartWrapper;