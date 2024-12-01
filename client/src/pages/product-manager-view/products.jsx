import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products from the API
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="product">
            <p>{product.name}</p>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageProducts;
