import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/all");
        setProducts(response.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/delete`, {
        params: { _id: productId },
      });
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="p-4 border rounded shadow-md">
            <img src={`/product-images/${product.image}`} alt={product.name} className="w-full h-32 object-cover" />
            <h3 className="font-bold mt-2">{product.name}</h3>
            <p>{product.description}</p>
            <p className="text-gray-700 font-semibold">Price: ${product.price}</p>
            <p className="text-gray-700 font-semibold">Quantity: {product.quantityInStock}</p>
            <p className="text-gray-700 font-semibold">Rating: {product.rating}/5</p>
            <button
              onClick={() => handleDelete(product._id)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
