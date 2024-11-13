import React, { useEffect, useState, Fragment } from 'react';
import { ArrowUpDownIcon } from 'lucide-react';

function ShoppingHome() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 4; // Number of products per page
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        gender: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        rating: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        categories: [],
        brands: [],
        genders: [],
        priceRange: { min: 0, max: 0 },
        inStockOptions: [],
        ratings: []
    });
    const [sortOption, setSortOption] = useState({ field: '', order: '' });

    useEffect(() => {
        fetchFilterOptions();
        fetchProducts(currentPage);
    }, [currentPage, filters, sortOption]);

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products/filters');
            if (!response.ok) {
                throw new Error('Failed to fetch filter options');
            }
            const data = await response.json();
            setFilterOptions(data);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchProducts = async (page) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page,
                limit,
                sort: sortOption.field,
                order: sortOption.order,
                ...filters
            }).toString();

            const response = await fetch(`http://localhost:5000/api/products/filter?${queryParams}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value
        }));
        setCurrentPage(1); // Reset to the first page when filters change
    };

    const handleSortChange = (e) => {
        const [field, order] = e.target.value.split('-');
        setSortOption({ field, order });
        setCurrentPage(1); // Reset to the first page when sort option changes
    };

    return (
        <div className="relative min-h-screen p-4 md:p-6 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                {/* Filters Section */}
                <div className="bg-background w-full rounded-lg shadow-sm">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-bold">Filters</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Category Filter */}
                        <Fragment>
                            <div className="w-full">
                                <h3 className="text-base font-semibold">Category</h3>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-40 p-1 border rounded text-sm"
                                >
                                    <option value="">All Categories</option>
                                    {filterOptions.categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Fragment>

                        {/* Brand Filter */}
                        <Fragment>
                            <div className="w-full">
                                <h3 className="text-base font-semibold">Brand</h3>
                                <select
                                    value={filters.brand || ''}
                                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    className="w-40 p-1 border rounded text-sm"
                                >
                                    <option value="">All Brands</option>
                                    {filterOptions.brands.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Fragment>

                        {/* Price Range Filter */}
                        <Fragment>
                            <div className="w-full">
                                <h3 className="text-base font-semibold">Price Range</h3>
                                <input
                                    type="number"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    placeholder="Min Price"
                                    className="w-28 p-1 border rounded mb-1 text-sm"
                                />
                                <input
                                    type="number"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    placeholder="Max Price"
                                    className="w-28 p-1 border rounded text-sm"
                                />
                            </div>
                        </Fragment>

                        {/* In Stock Filter */}
                        <Fragment>
                            <div className="w-full">
                                <h3 className="text-base font-semibold">In Stock</h3>
                                <input
                                    type="checkbox"
                                    checked={filters.inStock || false}
                                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                    className="mr-2"
                                />
                                <label>Show Only In Stock</label>
                            </div>
                        </Fragment>

                        {/* Rating Filter */}
                        <Fragment>
                            <div className="w-full">
                                <h3 className="text-base font-semibold">Rating</h3>
                                <input
                                    type="number"
                                    value={filters.rating || ''}
                                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                                    placeholder="Minimum Rating"
                                    className="w-28 p-1 border rounded text-sm"
                                    min="1"
                                    max="5"
                                />
                            </div>
                        </Fragment>

                        {/* Gender Filter */}
                        <Fragment>
                            <div className="w-full">
                                <h3 className="text-base font-semibold">Gender</h3>
                                <select
                                    value={filters.gender || ''}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    className="w-40 p-1 border rounded text-sm"
                                >
                                    <option value="">All</option>
                                    {filterOptions.genders.map((gender) => (
                                        <option key={gender} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Fragment>
                    </div>
                </div>

                {/* Products Section */}
                <div className="bg-background w-full rounded-lg shadow-sm relative">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-extrabold">All Products</h2>
                        <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white w-40 text-sm">
                            <ArrowUpDownIcon className="h-4 w-4" />
                            <select
                                value={`${sortOption.field}-${sortOption.order}`}
                                onChange={handleSortChange}
                                className="outline-none text-sm bg-white font-semibold"
                            >
                                <option value="" className="font-semibold">Sort by</option>
                                <option value="price-asc" className="font-semibold">Price: Low to High</option>
                                <option value="price-desc" className="font-semibold">Price: High to Low</option>
                                <option value="popularity-desc" className="font-semibold">Popularity</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {loading ? (
                            <p>Loading products...</p>
                        ) : (
                            products.map((product) => (
                                <div key={product._id} className="border p-4 rounded-lg">
                                    <img src={`/product-images/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-40 object-cover mb-2 rounded"
                                    />
                                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                    <p className="mb-2">{product.description}</p>
                                    <p className="mb-1"><strong>Price:</strong> ${product.price}</p>
                                    <p className="mb-1"><strong>Brand:</strong> {product.brand}</p>
                                    <p className="mb-1"><strong>Category:</strong> {product.category}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded bg-white text-black hover:bg-gray-200"
                >
                    Previous
                </button>

                {currentPage > 2 && (
                    <button onClick={() => handlePageChange(1)} className="p-2 border rounded bg-white text-black hover:bg-gray-200">
                        1
                    </button>
                )}
                {currentPage > 3 && <span className="p-2">...</span>}

                {currentPage > 1 && (
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="p-2 border rounded bg-white text-black hover:bg-gray-200"
                    >
                        {currentPage - 1}
                    </button>
                )}

                <button className="p-2 border rounded bg-gray-300 text-black font-bold">
                    {currentPage}
                </button>

                {currentPage < totalPages && (
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="p-2 border rounded bg-white text-black hover:bg-gray-200"
                    >
                        {currentPage + 1}
                    </button>
                )}

                {currentPage < totalPages - 2 && <span className="p-2">...</span>}
                {currentPage < totalPages - 1 && (
                    <button onClick={() => handlePageChange(totalPages)} className="p-2 border rounded bg-white text-black hover:bg-gray-200">
                        {totalPages}
                    </button>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded bg-white text-black hover:bg-gray-200"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ShoppingHome;
