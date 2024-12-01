import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useNavigate } from "react-router-dom"; // Added to enable navigation
import { useSelector } from "react-redux"; // Added to access user info from Redux

//IMPORTANT NOTES!!
//<ShoppingOrders /> will be added to the line 23

function ShoppingAccount() {
  const user = useSelector((state) => state.auth.user); // Access user data from Redux
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
      // Navigate to the confirm-delete page with user info
      navigate("/shop/account/confirm-delete", { state: { user } });
  };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen"> {/* Centers content vertically and horizontally */}
        <div className="relative h-[200px] w-[200px] overflow-hidden"> {/* Adjust width and height as needed */}
          <img
            src={accImg}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address">
                <Address />
              </TabsContent>
            </Tabs>
          </div>
                {/* Added delete account button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                    >
                        Delete My Account
                    </button>
                </div>
        </div>
      </div>
    );
  }
  
  export default ShoppingAccount;