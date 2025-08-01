import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { AddShoppingCartOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import {
  useCartprod,
  useGetWishlist,
  useRemoveFromWishlist,
} from "./productquery";

const Wishlist = () => {
  const { data: wishlist, isLoading, isError } = useGetWishlist();
  const { mutate: addToCart, isLoading: isAddingToCart } = useCartprod();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const [quantities, setQuantities] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();


  const handleIncrease = (itemId) => {
    const item = wishlist?.find((item) => item.productId === itemId)?.product;
    if (item && item.item_quantity) {
      setQuantities((prevQuantities) => {
        const currentQuantity = prevQuantities[itemId] || 1;
        if (currentQuantity < item.item_quantity) {
          return { ...prevQuantities, [itemId]: currentQuantity + 1 };
        }
        toast.error(`Maximum quantity available is ${item.item_quantity}`);
        return prevQuantities;
      });
    } else {
      console.log("Item or item_quantity not found for itemId:", itemId);
      toast.error("Item information unavailable");
    }
  };

  const handleDecrease = (itemId) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[itemId] || 1;
      if (currentQuantity > 1) {
        return { ...prevQuantities, [itemId]: currentQuantity - 1 };
      }
      toast.error("Quantity cannot be less than 1");
      return prevQuantities;
    });
  };

  const handleAddToCart = (itemId) => {
    const quantity = quantities[itemId] || 1;
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Successfully added item to your cart");
        },
        onError: (error) => {
          console.error("Error adding to cart:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Failed to add the item to your cart");
        },
      }
    );
  };

  const handleBuyNow = (itemId) => {
    const quantity = quantities[itemId] || 1;
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Successfully added item to your cart");
          navigate(`/mycart`);
        },
        onError: (error) => {
          console.error("Error adding to cart:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Failed to add the item to your cart");
        },
      }
    );
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(
      { productId },
      {
        onSuccess: () => toast.success("Removed from wishlist"),
        onError: () => toast.error("Failed to remove from wishlist"),
      }
    );
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200 py-8 text-center">
        <Navbar />
        <div className="pt-32">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-200 py-8 text-center">
        <Navbar />
        <div className="pt-32">Error fetching wishlist!</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-32 bg-gray-200 h-full overflow-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="border-t border-gray-400 w-24"></div>
          <Typography className="mx-14 text-2xl font-semibold">My Wishlist</Typography>
          <div className="border-t border-gray-400 w-24"></div>
        </div>
        {!wishlist || wishlist.length === 0 ? (
          <Typography className="text-center text-lg">Your wishlist is empty.</Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-4">
            {wishlist.map((item) => (
              <Card
                key={item.productId}
                className="w-full max-w-3xs mx-auto shadow-lg rounded-4xl overflow-hidden cursor-pointer"
                onClick={() => handleOpenModal(item.product)}
              >
                <CardHeader shadow={false} floated={false} className="h-40">
                  <div className="flex justify-end">
                    <IconButton
                      variant="text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.productId);
                      }}
                      className="p-2"
                    >
                      <HeartFilled className="h-6 w-6 text-red-500" />
                    </IconButton>
                  </div>
                  <img
                    src={`https://localhost:3000/uploads/${item.product.image}`}
                    alt={item.product.item_name}
                    className="max-h-30 w-full object-contain"
                  />
                </CardHeader>
                <CardBody className="p-0">
                  <div className="flex justify-center items-center">
                    <Typography color="blue-gray" className="font-bold text-lg">
                      {item.product.item_name}
                    </Typography>
                  </div>
                  <Typography
                    color="blue-gray"
                    className="font-bold text-lg flex items-center justify-center"
                  >
                    Price: Rs.{item.product.item_price}
                  </Typography>
                  <div className="flex justify-center items-center mt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrease(item.productId);
                      }}
                      className="bg-gray-300 px-3 py-1 text-lg font-bold text-black"
                      disabled={(quantities[item.productId] || 1) <= 1}
                    >
                      -
                    </Button>
                    <span className="mx-10 text-lg font-semibold">
                      {quantities[item.productId] || 1}
                    </span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrease(item.productId);
                      }}
                      className="bg-gray-300 px-3 py-1 text-lg font-extrabold text-black"
                      disabled={
                        (quantities[item.productId] || 1) >= item.product.item_quantity
                      }
                    >
                      +
                    </Button>
                  </div>
                </CardBody>
                <CardFooter className="pt-4 pb-4 flex px-11">
                  <Button
                    ripple={false}
                    fullWidth={true}
                    className="bg-[#D72638] py-0 rounded-r text-white shadow-md hover:scale-105 transition-transform duration-200 hover:bg-green-300 hover:text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(item.productId);
                    }}
                    disabled={isAddingToCart}
                  >
                    <ShoppingBagOutlined />
                    Buy Now
                  </Button>
                  <Button
                    ripple={false}
                    fullWidth={true}
                    className="bg-[#333333] flex-1/12 p-2 rounded-l text-white shadow-md hover:scale-105 transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item.productId);
                    }}
                    disabled={isAddingToCart}
                  >
                    <AddShoppingCartOutlined />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {selectedProduct && (
          <Dialog open={openModal} handler={handleCloseModal} className="max-w-lg">
            <DialogHeader className="flex justify-between items-center">
              <Typography variant="h5" color="blue-gray">
                {selectedProduct.item_name}
              </Typography>
              <IconButton
                variant="text"
                onClick={() => handleRemoveFromWishlist(selectedProduct._id)}
                className="p-2"
              >
                <HeartFilled className="h-6 w-6 text-red-500" />
              </IconButton>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-4">
              <img
                src={`https://localhost:3000/uploads/${selectedProduct.image}`}
                alt={selectedProduct.item_name}
                className="w-full h-64 object-contain rounded-lg"
              />
              <Typography color="blue-gray" className="font-bold">
                Price: Rs.{selectedProduct.item_price}
              </Typography>
              <Typography color="blue-gray">
                Available Quantity: {selectedProduct.item_quantity || "N/A"}
              </Typography>
              <Typography color="blue-gray">
                Description: {selectedProduct.description || "No description available"}
              </Typography>
              <div className="flex items-center gap-4">
                <Typography color="blue-gray" className="font-semibold">
                  Quantity:
                </Typography>
                <Button
                  onClick={() => handleDecrease(selectedProduct._id)}
                  className="bg-gray-300 px-3 py-1 text-lg font-bold text-black"
                  disabled={(quantities[selectedProduct._id] || 1) <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-semibold">
                  {quantities[selectedProduct._id] || 1}
                </span>
                <Button
                  onClick={() => handleIncrease(selectedProduct._id)}
                  className="bg-gray-300 px-3 py-1 text-lg font-extrabold text-black"
                  disabled={
                    (quantities[selectedProduct._id] || 1) >= selectedProduct.item_quantity
                  }
                >
                  +
                </Button>
              </div>
            </DialogBody>
            <DialogFooter className="flex gap-4">
              <Button
                variant="outlined"
                color="red"
                onClick={handleCloseModal}
                className="rounded-2xl"
              >
                Close
              </Button>
              <Button
                className="bg-black rounded-2xl text-white hover:bg-green-300 hover:text-black"
                onClick={() => handleAddToCart(selectedProduct._id)}
                disabled={isAddingToCart}
              >
                <AddShoppingCartOutlined />
                Add to Cart
              </Button>
              <Button
                className="bg-[#D72638] rounded-2xl text-white hover:bg-green-300 hover:text-black"
                onClick={() => handleBuyNow(selectedProduct._id)}
                disabled={isAddingToCart}
              >
                <ShoppingBagOutlined />
                Buy Now
              </Button>
            </DialogFooter>
          </Dialog>
        )}

        <Toaster
          position="top-right"
          autoClose={2500}
          containerStyle={{
            top: "8rem",
            right: "1rem",
          }}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;