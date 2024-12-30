import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPen } from "lucide-react";
import ViewInvoices from "@/components/sales-manager-view/ViewInvoices";
import SetPrices from "@/pages/sales-manager-view/SetPrices";
import CalculateRevenueLoss from "@/components/sales-manager-view/revenueloss";
import { useNavigate } from "react-router-dom"; // Added to enable navigation
import { useSelector } from "react-redux"; // Added to access user info from Redux

function SalesManagerAccount() {
  const user = useSelector((state) => state.auth.user); // Access user data from Redux

    return (
      <div className="flex flex-col items-center justify-center min-h-screen"> {/* Centers content vertically and horizontally */}
        <div className="relative h-[200px] w-[200px] overflow-hidden"> {/* Adjust width and height as needed */}
          <UserPen className="h-full w-full object-cover object-center" />
        </div>
        <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Set Prices</TabsTrigger>
                <TabsTrigger value="products">Apply Discounts</TabsTrigger>
                <TabsTrigger value="orders">View Invoices</TabsTrigger>
                <TabsTrigger value="Search Orders">Calculate Revenue/Loss</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                {<SetPrices />}
              </TabsContent>
              <TabsContent value="products">
                {/*<Apply Discounts/>*/}
              </TabsContent>
              <TabsContent value="orders">
                <ViewInvoices />
              </TabsContent>
              <TabsContent value="Search Orders">
                <CalculateRevenueLoss/>
              </TabsContent>
              
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
  
  export default SalesManagerAccount;