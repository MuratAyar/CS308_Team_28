import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import axios from "axios";
import { apiUrl } from "../../config/api";

function SalesManagerDiscount() {
  const [products, setProducts] = useState([]);
  const [discountRate, setDiscountRate] = useState({}); // Store discount rates per product
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
        const response = await axios.get(apiUrl("/api/products/all"), {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to request headers
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  const handleApplyDiscount = async (productId) => {
    const rate = discountRate[productId];
    if (!rate || rate <= 0 || rate > 100) {
      alert("Please enter a valid discount rate between 1 and 100.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
      const response = await axios.put(
        apiUrl("/api/products/discount"),
        {
          productId,
          discountRate: rate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to request headers
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, salesPrice: response.data.product.salesPrice }
            : product
        )
      );

      alert("Discount applied successfully.");
    } catch (error) {
      console.error("Error applying discount:", error);
      alert("Failed to apply discount. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndoDiscount = async (productId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
      await axios.put(
        apiUrl("/api/products/undo-discount"),
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to request headers
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, salesPrice: null } : product
        )
      );

      alert("Discount undone successfully.");
    } catch (error) {
      console.error("Error undoing discount:", error);
      alert("Failed to undo discount. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (productId, value) => {
    setDiscountRate((prevRates) => ({ ...prevRates, [productId]: value }));
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="px-10 bg-gray-50 py-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Manage Discounts</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="w-full text-left p-6 font-bold text-gray-700">Product Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center p-6 text-gray-600">
                No products available.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product._id} className="bg-white border-b hover:bg-gray-100">
                <TableCell className="text-left p-6">
                  <div className="flex flex-col space-y-4">
                    <span className="text-lg font-medium text-gray-800">{product.name}</span>
                    <div className="mt-2 flex flex-wrap sm:flex-nowrap sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Price: ${product.price.toFixed(2)}</span>
                        <span className="text-gray-700">Reduced Price: {product.salesPrice ? `$${product.salesPrice.toFixed(2)}` : "-"}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <Input
                          type="number"
                          placeholder="Discount %"
                          value={discountRate[product._id] || ""}
                          onChange={(e) => handleInputChange(product._id, e.target.value)}
                          className="h-8 border-gray-300 rounded-md shadow-sm"
                        />
                        <Button
                          onClick={() => handleApplyDiscount(product._id)}
                          disabled={isLoading}
                          className="bg-gray-800 hover:bg-gray-800 text-gray-50"
                        >
                          Apply Discount
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleUndoDiscount(product._id)}
                          disabled={isLoading}
                          className="bg-rose-800 hover:bg-rose-800 text-gray-50"
                        >
                          Undo Discount
                        </Button>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default SalesManagerDiscount;
