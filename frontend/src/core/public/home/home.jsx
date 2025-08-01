import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Corousal from "../../../components/corousal";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import { NewArrivals } from "../product/newarrivals";
import { OurFavorites } from "../product/ourfavorites";
import { Popular } from "../product/popular";
import { useCartprod } from "../product/productquery"; // Adjust path as needed
import { WatchforMan } from "../product/watchforman";
import { WatchforWomen } from "../product/watchforwomen";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [quantities, setQuantities] = useState({});
    const { mutate: addToCart, isLoading: isAddingToCart } = useCartprod();

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`https://localhost:3000/api/items/search?query=${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    };

    const handleAddToCart = (itemId) => {
        const quantity = quantities[itemId] || 1;
        addToCart(
            { itemId, quantity },
            {
                onSuccess: () => {
                    toast.success("Item added to cart successfully!", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                },
                onError: (error) => {
                    toast.error("Failed to add item to cart.", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                },
            }
        );
    };
    return (
        <div className="bg-gray-100">
            <Navbar />
            <div className="pt-32">
                {/* <h1 className="text-center text-3xl font-bold mb-8">What are you looking for?</h1> */}
                {/* SEARH BAR */}
                {/* <div className="flex justify-center">
                    <div className="relative w-full max-w-3xl">
                        <textarea
                            className="w-full p-4 pl-12 border border-gray-300 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search..."
                            rows="1"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        ></textarea>
                        <img
                            src="https://img.icons8.com/?size=100&id=95149&format=png&color=000000"
                            alt="search"
                            className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2"
                        />
                    </div>
                </div> */}

                {/* Search Results */}
                {searchQuery && (
                    <div className="max-w-6xl mx-auto mt-6">
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {searchResults.map((item) => (
                                    <Card
                                        key={item._id}
                                        className="w-full bg-gradient-to-b from-blue-400 to bg-cyan-200 max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden"
                                    >
                                        <CardHeader shadow={false} floated={false} className="h-48">
                                            <img
                                                src={`https://localhost:3000/uploads/${item.image}`}
                                                alt={item.item_name}
                                                className="h-full w-full object-fill"
                                            />
                                        </CardHeader>
                                        <CardBody className="p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <Typography color="blue-gray" className="font-medium text-lg">
                                                    {item.item_name}
                                                </Typography>
                                                <Typography color="blue-gray" className="font-medium text-lg">
                                                    ${item.item_price}
                                                </Typography>
                                            </div>
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="font-normal text-sm opacity-75"
                                            >
                                                {item.description.length > 80
                                                    ? `${item.description.substring(0, 80)}...`
                                                    : item.description}
                                            </Typography>
                                            <div className="flex justify-center items-center mt-4">
                                                <Button
                                                    onClick={() => handleDecrease(item._id)}
                                                    className="bg-red-400 px-3 py-1 text-lg font-bold"
                                                >
                                                    -
                                                </Button>
                                                <span className="mx-4 text-lg font-semibold">
                                                    {quantities[item._id] || 1}
                                                </span>
                                                <Button
                                                    onClick={() => handleIncrease(item._id)}
                                                    className="bg-green-300 px-3 py-1 text-lg font-bold"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </CardBody>
                                        <CardFooter className="pt-4 pb-4">
                                            <Button
                                                ripple={false}
                                                fullWidth={true}
                                                className="bg-blue-gray-900 text-white shadow-md hover:scale-105 transition-transform duration-200"
                                                onClick={() => handleAddToCart(item._id)}
                                                disabled={isAddingToCart}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No items found</p>
                        )}
                   
                    </div>
                )}

                {/* Default Content */}
                {!searchQuery && (
                    <>
                        <Corousal />
                        <div>
                            <NewArrivals />                        </div>
                        <Popular />
                        <WatchforWomen />
                        
                        <div>
                            <WatchforMan />
                        </div>

                        
                        <div>
                            <OurFavorites />
                        </div>
                    </>
                )}
            </div>
            <Footer />
          
        </div>
    );
};

export default Home;