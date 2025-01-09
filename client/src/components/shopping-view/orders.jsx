import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  // Fetch all orders by user ID on component mount
  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  // Open the details dialog when order details are fetched
  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Fetch order details
  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  // Handle cancel or refund request
  const handleCancelOrRefund = async (orderId, orderStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shop/order/cancel-or-refund/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        dispatch(getAllOrdersByUserId(user?.id)); // Refresh the order list
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error cancelling or refunding order:", error);
      alert("An error occurred.");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
              <TableHead>
                <span className="sr-only">Cancel/Refund</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "processing"
                            ? "bg-yellow-500"
                            : orderItem?.orderStatus === "in-transit"
                            ? "bg-blue-500"
                            : orderItem?.orderStatus === "delivered"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "waiting-for-refund"
                            ? "bg-orange-500"
                            : orderItem?.orderStatus === "cancelled"
                            ? "bg-red-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleCancelOrRefund(orderItem?._id, orderItem?.orderStatus)
                        }
                      >
                        {orderItem?.orderStatus === "processing"
                          ? "Cancel Order"
                          : ["in-transit", "delivered"].includes(orderItem?.orderStatus)
                          ? "Request Refund"
                          : "Unavailable"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;