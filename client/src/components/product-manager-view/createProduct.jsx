// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import { apiUrl } from "../../config/api";
import axios from 'axios';

const ProductListing = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [editingQuantity, setEditingQuantity] = useState({}); // State for managing quantity edits

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiUrl("/api/products/all"));
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle stock quantity update
  const saveQuantityChange = async (productId) => {
    const newQuantity = editingQuantity[productId];

    try {
      const response = await axios.put(
        apiUrl(`/api/products/update-stock/${productId}`),
        { newQuantity } // Send `newQuantity` in the request body
      );

      if (response.data.product) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, quantityInStock: newQuantity }
              : product
          )
        );
        // Clear the editing state for the updated product
        setEditingQuantity((prev) => {
          const updatedState = { ...prev };
          delete updatedState[productId];
          return updatedState;
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error.response?.data || error);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(apiUrl("/api/products/delete"), {
        params: { _id: productId },
      });

      if (response.data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="p-6">
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
            <span className="block text-gray-500">Rating: {product.rating}/5</span>

            <div className="mt-4">
              <span className="block text-gray-500 mb-2">
                Quantity: {editingQuantity[product._id] ?? product.quantityInStock}
              </span>
              <input
                type="number"
                value={editingQuantity[product._id] ?? product.quantityInStock}
                onChange={(e) =>
                  setEditingQuantity({
                    ...editingQuantity,
                    [product._id]: parseInt(e.target.value, 10),
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={() => saveQuantityChange(product._id)}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-transform"
              >
                Save Quantity
              </button>
            </div>

            <button
              onClick={() => handleDelete(product._id)}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
