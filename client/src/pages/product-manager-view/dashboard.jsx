import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog } from "lucide-react";

import ManageSearchOrders from "@/components/product-manager-view/searchOrders";
import PendingComments from "@/components/product-manager-view/pending-comments";
import ManageOrders from "@/components/product-manager-view/orders";
import ProductForm from "@/components/product-manager-view/createPP";

import { useNavigate } from "react-router-dom"; // Added to enable navigation
import { useSelector } from "react-redux"; // Added to access user info from Redux
import ProductListing from "@/components/product-manager-view/createProduct";
import DeleteCategory from "@/components/product-manager-view/deleteCategory";

import ViewInvoices from "@/components/sales-manager-view/ViewInvoices";

function ProductManagerAccount() {
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
                <TabsTrigger value="orders">All Orders</TabsTrigger>
                <TabsTrigger value="Search Orders">Search Orders</TabsTrigger>
                <TabsTrigger value="View Invoices">View Invoices</TabsTrigger>
                <TabsTrigger value="Create Product">Create Product</TabsTrigger>
                <TabsTrigger value="Delete Category">Delete Category</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                <PendingComments />
              </TabsContent>
              <TabsContent value="products">
                <ProductListing/>
              </TabsContent>
              <TabsContent value="orders">
                <ManageOrders/>
              </TabsContent>
              <TabsContent value="Search Orders">
                <ManageSearchOrders/>
              </TabsContent>
              <TabsContent value="View Invoices">
                <ViewInvoices />
              </TabsContent>
              <TabsContent value="Create Product">
                <ProductForm/>
              </TabsContent>
              <TabsContent value="Delete Category">
                <DeleteCategory/>
              </TabsContent>
              
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
  
  export default ProductManagerAccount;