import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPen } from "lucide-react";
import ViewInvoices from "@/components/sales-manager-view/ViewInvoices";
import SetPrices from "@/pages/sales-manager-view/SetPrices";
import CalculateRevenueLoss from "@/components/sales-manager-view/revenueloss";
import { useNavigate } from "react-router-dom"; // Added to enable navigation
import { useSelector } from "react-redux"; // Added to access user info from Redux
import SalesManagerDiscount from "@/pages/sales-manager-view/SalesManagerDiscount";
import EvaluateRefunds from "@/components/sales-manager-view/evaluateRefunds";

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
                <TabsTrigger value="Set Prices">Set Prices</TabsTrigger>
                <TabsTrigger value="Apply Discounts">Apply Discounts</TabsTrigger>
                <TabsTrigger value="View Invoices">View Invoices</TabsTrigger>
                <TabsTrigger value="Calculate Revenue/Loss">Calculate Revenue/Loss</TabsTrigger>
                <TabsTrigger value="Evaluate Waiting Refunds">Evaluate Waiting Refunds</TabsTrigger>
              </TabsList>
              <TabsContent value="Set Prices">
                {<SetPrices />}
              </TabsContent>
              <TabsContent value="Apply Discounts">
                {<SalesManagerDiscount />}
              </TabsContent>
              <TabsContent value="View Invoices">
                <ViewInvoices />
              </TabsContent>
              <TabsContent value="Calculate Revenue/Loss">
                <CalculateRevenueLoss/>
              </TabsContent>
              <TabsContent value="Evaluate Waiting Refunds">
                <EvaluateRefunds/>
              </TabsContent>
              
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
  
  export default SalesManagerAccount;