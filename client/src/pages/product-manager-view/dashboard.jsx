import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog } from "lucide-react";
import Address from "@/components/shopping-view/address";
import PendingComments from "@/components/product-manager-view/pending-comments";
import { useNavigate } from "react-router-dom"; // Added to enable navigation
import { useSelector } from "react-redux"; // Added to access user info from Redux

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
          <UserCog className="h-full w-full object-cover object-center" />
        </div>
        <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Pending Comments</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                <PendingComments />
              </TabsContent>
              <TabsContent value="products">
                {/* <Products /> */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
  
  export default ShoppingAccount;