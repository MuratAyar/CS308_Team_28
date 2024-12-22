import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; // Import your Button component
import { useToast } from "@/hooks/use-toast"; // Import your custom useToast hook

const SetPrices = () => {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const { toast } = useToast(); // Destructure toast function from useToast

  const handleSetPrice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:5000/api/products/${productId}/set-price`,
        { price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast({
        title: "Success",
        description: `Price updated to ${price}!`,
        status: "success", // Example; customize based on your toast system
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while updating the price.",
        status: "error", // Example; customize based on your toast system
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Set Product Price</h2>
      <form onSubmit={handleSetPrice} className="space-y-4">
        <div>
          <label htmlFor="productId" className="block font-medium">
            Product ID
          </label>
          <input
            type="text"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter Product ID"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter New Price"
            required
          />
        </div>
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Set Price
        </Button>
      </form>
    </div>
  );
};

export default SetPrices;
