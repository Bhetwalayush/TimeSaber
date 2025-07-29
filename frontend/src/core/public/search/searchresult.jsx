import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../../components/navbar";
import {
  useAddToWishlist,
  useCartprod,
  useGetWishlist,
  useRemoveFromWishlist,
} from "../product/productquery";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filters, setFilters] = useState({
    category: '',
    productType: '',
    priceMin: '',
    priceMax: '',
    brand: '',
    sortBy: 'name'
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    productType: true,
    price: true,
    brand: true
  });

  const location = useLocation();
  const { data: wishlist, isLoading: isWishlistLoading } = useGetWishlist();
  const { mutate: addToCart } = useCartprod();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const filterOptions = {
    categories: ['Wallet', 'School Bag', 'Office Bag', 'Trekking Bag', 'Women watch', 'Sports Bag'],
    productTypes: ['Backpack', 'Handbag', 'Tote Bag', 'Messenger Bag', 'Duffel Bag', 'Clutches'],
    brands: [ 'TimeSaber','Nike', 'Adidas', 'Puma', 'Gucci', 'Prada', 'Louis Vuitton', 'Coach', 'Michael Kors'],
    sortOptions: [
      { value: 'name', label: 'Name A-Z' },
      { value: 'price-low', label: 'Price Low to High' },
      { value: 'price-high', label: 'Price High to Low' },
      { value: 'newest', label: 'Newest First' }
    ]
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query);
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [searchResults, filters]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/items/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      toast.error("Failed to fetch search results");
    }
  };

  const applyFilters = () => {
    let filtered = [...searchResults];

    if (filters.category) {
      filtered = filtered.filter(item => 
        item.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.productType) {
      filtered = filtered.filter(item => 
        item.productType?.toLowerCase().includes(filters.productType.toLowerCase()) ||
        item.item_name?.toLowerCase().includes(filters.productType.toLowerCase())
      );
    }

    if (filters.priceMin) {
      filtered = filtered.filter(item => item.item_price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(item => item.item_price <= parseFloat(filters.priceMax));
    }

    if (filters.brand) {
      filtered = filtered.filter(item => 
        item.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.item_name.localeCompare(b.item_name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.item_price - b.item_price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.item_price - a.item_price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredResults(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      productType: '',
      priceMin: '',
      priceMax: '',
      brand: '',
      sortBy: 'name'
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleIncrease = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };

  const handleDecrease = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 1),
    }));
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/items/search?query=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  const handleAddToCart = async (itemId) => {
    setIsAdding(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      if (!token || !userId) {
        toast.error("Please login to add items to cart");
        return;
      }

      addToCart(
        { itemId, quantity: quantities[itemId] || 1 },
        {
          onSuccess: () => {
            toast.success("Item added to cart!");
          },
          onError: (error) => {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add item to cart");
          },
        }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = (productId) => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    const isInWishlist = wishlist?.some((item) => item.productId === productId);
    if (isInWishlist) {
      removeFromWishlist(
        { productId, userId },
        {
          onSuccess: () => toast.success("Removed from wishlist"),
          onError: () => toast.error("Failed to remove from wishlist"),
        }
      );
    } else {
      addToWishlist(
        { productId, userId },
        {
          onSuccess: () => toast.success("Added to wishlist"),
          onError: () => toast.error("Failed to add to wishlist"),
        }
      );
    }
  };

 

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-8 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-center text-3xl font-bold mb-8">What are you looking for?</h1>
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                className="w-full p-4 pl-6 pr-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for ....."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Search className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full px-4 py-8 mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">FILTER</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Categories
                  {expandedSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.category && (
                  <div className="space-y-2">
                    {filterOptions.categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('productType')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Product Type
                  {expandedSections.productType ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.productType && (
                  <div className="space-y-2">
                    {filterOptions.productTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="productType"
                          value={type}
                          checked={filters.productType === type}
                          onChange={(e) => handleFilterChange('productType', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Price
                  {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.price && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-gray-500">TO</span>
                      <input
                        type="number"
                        placeholder="1000000"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('brand')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Brands
                  {expandedSections.brand ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.brand && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Search for..."
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {filterOptions.brands
                        .filter(brand => brand.toLowerCase().includes(filters.brand.toLowerCase()))
                        .map((brand) => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="radio"
                              name="brand"
                              value={brand}
                              checked={filters.brand === brand}
                              onChange={(e) => handleFilterChange('brand', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-600">{brand}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Products</h2>
                  <p className="text-sm text-gray-600">Items Found: {filteredResults.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort By:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    {filterOptions.sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredResults.map((item) => (
                    <Card key={item._id} className="w-full shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader shadow={false} floated={false} className="h-48 relative">
                        <div className="absolute top-2 right-2">
                        <Button
                          variant="text"
                          onClick={() => handleToggleWishlist(item._id)}
                          className="absolute top-2 right-2 p-2 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
                        >
                          {wishlist?.some((wishlistItem) => wishlistItem.productId === item._id) ? (
                            <HeartFilled className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartOutline className="h-5 w-5 text-gray-400 hover:text-red-500" />
                          )}
                        </Button></div><div>
                        <img
                          src={item.image ? `http://localhost:3000/uploads/${item.image}` : '/api/placeholder/300/300'}
                          alt={item.item_name}
                          className="h-full w-full object-cover"
                        /></div>
                      </CardHeader>
                      <CardBody className="p-4">
                        <Typography className="font-semibold text-center mb-2">
                          {item.item_name}
                        </Typography>
                        <Typography className="text-center font-bold text-lg mb-3">
                          Price: Rs {item.item_price}
                        </Typography>
                        
                        <div className="flex justify-center items-center gap-4">
                          <Button
                            onClick={() => handleDecrease(item._id)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </Button>
                          <span className="font-semibold text-lg">
                            {quantities[item._id] || 1}
                          </span>
                          <Button
                            onClick={() => handleIncrease(item._id)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </Button>
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0 pb-4 px-4">
                        <Button
                          fullWidth
                          className="bg-green-400 hover:bg-green-500 text-black rounded-lg normal-case text-sm"
                          onClick={() => handleAddToCart(item._id)}
                          disabled={isAdding}
                        >
                          Add To Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No items found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        style={{ top: "8rem" }} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default SearchResults;