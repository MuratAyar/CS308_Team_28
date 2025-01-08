import React, { useState, useEffect } from 'react'; // Properly import React and hooks
import axios from 'axios';

const DeleteCategory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Store available categories
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category for deletion

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/all');
        setProducts(response.data.products);

        // Extract unique categories from products
        const uniqueCategories = [...new Set(response.data.products.map((product) => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/products/delete-category/${selectedCategory}`);
      if (response.data.success) {
        // Remove deleted products from state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.category !== selectedCategory)
        );
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting category:', error.response?.data || error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Delete by Category</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={handleDeleteCategory}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Category
          </button>
        </div>
      </div>

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
            <span className="block text-gray-500">Category: {product.category}</span>
            <span className="block text-gray-500">Quantity: {product.quantityInStock}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeleteCategory; // Component name starts with uppercase
