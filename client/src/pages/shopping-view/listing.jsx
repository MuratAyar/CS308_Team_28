import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";

// Mocked product data for manual display
const mockProductList = [
  {
    _id: "6723e858def2d3a1cfa49996",
    name: "Liforme Yoga Mat",
    price: 29.99,
    image: "liforme.jpg",
    description: "Eco-friendly yoga mat for comfort and stability.",
  },
  {
    _id: "6723e858def2d3a1cfa49997",
    name: "Wilson Tennis Racket",
    price: 89.99,
    image: "wilson.jpg",
    description: "Professional tennis racket for competitive play.",
  },
  {
    _id: "6723e858def2d3a1cfa49999",
    name: "Spalding Basketball Ball",
    price: 24.99,
    image: "spalding.jpg",
    description: "Durable basketball for outdoor and indoor play.",
  },
  {
    _id: "6723eb61def2d3a1cfa4999c",
    name: "Bell Mountain Bike Helmet",
    price: 59.99,
    image: "bell_mountain.jpg",
    description: "Durable helmet ideal for mountain biking.",
  },
  {
    _id: "6723eb61def2d3a1cfa4999d",
    name: "Babolat Pure Strike Tennis Racket",
    price: 109.99,
    image: "pure_strike.jpg",
    description: "A balanced racket for power and precision.",
  },
  {
    _id: "6723eb61def2d3a1cfa4999e",
    name: "Adidas Ultraboost Running Shoes",
    price: 79.99,
    image: "adidas.jpg",
    description: "High-performance shoes with responsive cushioning.",
  }
];

function ShoppingListing() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("useEffect triggered");
        // Dispatch real API call when API is connected
        // dispatch(fetchAllFilteredProducts());
    }, [dispatch]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6 mt-10">
            <ProductFilter />
            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Products</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{mockProductList.length} Products</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span>Sort by</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup>
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem key={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {mockProductList.map((productItem) => (
                        <div key={productItem._id} className="border p-4 rounded-lg">
                            <img
                                src={`/product-images/${productItem.image}`}
                                alt={productItem.name}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <h3 className="mt-2 font-semibold">{productItem.name}</h3>
                            <p className="text-muted-foreground">{productItem.description}</p>
                            <p className="mt-1 font-bold">${productItem.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShoppingListing;