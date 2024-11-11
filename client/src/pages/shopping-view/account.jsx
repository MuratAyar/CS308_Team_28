import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

//IMPORTANT NOTES!!
//<ShoppingOrders /> will be added to the line 23

function ShoppingAccount() {
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
                <p>Order data not available yet.</p>
              </TabsContent>
              <TabsContent value="address">
                <Address />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
  
  export default ShoppingAccount;