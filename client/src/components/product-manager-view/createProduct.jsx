import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductListing = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetching all products without pagination and sorting
        const response = await axios.get('http://localhost:5000/api/products/all');
        console.log(response.data);
        setProducts(response.data.products); // Set the products in state
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      // Sending DELETE request with the product _id as query parameter
      const response = await axios.delete(`http://localhost:5000/api/products/delete`, {
        params: { _id: productId }, // Passing _id as query parameter
      });
      
      if (response.data.success) {
        // Removing the deleted product from the UI state
        setProducts(products.filter(product => product._id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-around gap-6">
        {/* Mapping through the products and displaying them */}
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-lg w-60 text-center transition-transform transform hover:scale-105 hover:shadow-xl">
            <img src={`/product-images/${product.image}`} alt={product.name} className="w-full h-auto rounded-lg object-cover" />
            <h2 className="text-lg font-bold text-gray-800 mt-3">{product.name}</h2>
            <p className="text-sm text-gray-600 my-2 h-16 overflow-hidden text-ellipsis">{product.description}</p>
            <span className="block text-gray-800 font-semibold">Price: ${product.price}</span>
            <span className="block text-gray-500">Quantity: {product.quantityInStock}</span>
            <span className="block text-gray-500">Rating: {product.rating}/5</span>
            {/* Delete button */}
            <button 
              onClick={() => handleDelete(product._id)} 
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors transform hover:scale-105 active:scale-95"
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
