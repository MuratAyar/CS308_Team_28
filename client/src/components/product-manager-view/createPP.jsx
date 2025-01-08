// ProductForm.jsx
import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ProductForm = ({ setProducts }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    quantityInStock: 0,
    serialNumber: '',
    category: '', // Added category field
  });

  const handleCreateProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        price: 0, // Price is set to 0 when creating a product
      };

      const response = await axios.post('http://localhost:5000/api/products/add', payload);

      if (response.data.success) {
        setProducts((prevProducts) => [...prevProducts, response.data.product]);
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          quantityInStock: 0,
          serialNumber: '',
          category: '', // Reset category field
        });
      }
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a New Product</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Product Description</label>
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Serial Number</label>
        <input
          type="text"
          name="serialNumber"
          value={newProduct.serialNumber}
          onChange={handleInputChange}
          placeholder="Enter product serial number"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Stock Quantity</label>
        <input
          type="number"
          name="quantityInStock"
          value={newProduct.quantityInStock}
          onChange={handleInputChange}
          placeholder="Enter stock quantity"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={newProduct.category}
          onChange={handleInputChange}
          placeholder="Enter product category"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleCreateProduct}
        className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Product
      </button>
    </div>
  );
};

ProductForm.propTypes = {
  setProducts: PropTypes.func.isRequired, // Ensure setProducts is passed as a prop
};

export default ProductForm;
