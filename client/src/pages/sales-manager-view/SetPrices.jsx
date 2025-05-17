import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "../../config/api";

const SetPrices = () => {
  const [products, setProducts] = useState([]); // List of products
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiUrl("/api/products/all"));
        const sortedProducts = response.data.products.sort((a, b) => a.price - b.price); // Sort by price (ascending)
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle setting the price of a specific product
  const handleSetPrice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        apiUrl(`/api/products/${productId}/set-price`),
        { price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product's price in the UI
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, price } : product
        )
      );

      // Show success toast
      toast({
        title: "Success",
        description: `Price updated to ${price}!`,
        status: "success",
      });

      // Clear the input fields
      setProductId("");
      setPrice("");
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "An error occurred while updating the price.",
        status: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Set Product Price</h2>
      {/* Form for setting the price */}
      <form onSubmit={handleSetPrice} className="space-y-4 mb-6">
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

      {/* Product listing */}
      <div className="flex flex-wrap justify-around gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow-lg w-60 text-center transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <img
              src={`/product-images/${product.image}`}
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
            />
            <h2 className="text-lg font-bold text-gray-800 mt-3">{product.name}</h2>
            <p className="text-sm text-gray-600 my-2 h-16 overflow-hidden text-ellipsis">
              {product.description}
            </p>
            <span className="block text-gray-800 font-semibold">Price: ${product.price}</span>
            <span className="block text-gray-500">Quantity: {product.quantityInStock}</span>
           
            <Button
              onClick={() => {
                setProductId(product._id); // Pre-fill productId
                setPrice(product.price); // Pre-fill current price
              }}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95"
            >
              Edit Price
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetPrices;
