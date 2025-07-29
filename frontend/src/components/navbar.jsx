import { DeliveryDiningOutlined } from "@mui/icons-material";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { ChevronDown, Heart, Home, LogIn, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token !== null);
    if (token) {
      fetchCartCount();
      fetchWishlistCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      if (userId && token) {
        const response = await axios.get(`https://localhost:3000/api/cart/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = response.data[0]?.items || [];
        const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      if (userId && token) {
        const response = await axios.get(`https://localhost:3000/api/wishlist?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistCount(response.data.wishlist.length || 0);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setCartCount(0);
    setWishlistCount(0);
  };

  const handleLogoClick = () => {
    if (userRole === "admin") {
      navigate("/admindashboard");
    } else {
      navigate("/");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="w-full border-b fixed z-10 bg-cyan-300">
      <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <a href="#" onClick={handleLogoClick} className="flex items-center ml-2 md:ml-20">
          <img
            src="../src/assets/images/logo.png"
            alt="Pharm Logo"
            className="h-10 md:h-16 w-auto"
          />
        </a>

        <div className="relative w-full max-w-xl mx-4 flex">
          <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  className="w-full pl-4 pr-12 py-2 h-11 border border-gray-300 rounded-l shadow-sm focus:outline-none bg-white"
  placeholder="Search  "
/>

          <button
            onClick={handleSearch}
            className="bg-red-500 px-3 rounded-r flex items-center justify-center"
          >
            <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-6 w-6 text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
  />
</svg>

          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="/" className="flex items-center space-x-1">
            <Home />
            <span className="text-sm">Home</span>
          </a>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center text-sm font-medium hover:text-emerald-600">
              Categories <ChevronDown size={19} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="absolute bg-white shadow-lg rounded-md mt-2 w-40 p-1 z-50">
                {["menwatch", "womenwatch", "ourfavorites", "officebags", "travelbags"].map((cat) => (
                  <a
                    key={cat}
                    href={`/${cat}`}
                    className="flex justify-between px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {cat.replace("watch", " Watch").replace("women", "Women").replace("men", "Men").replace("ourfavorites","OurFavorites").replace("officebags","Popular").replace("travelbags","NewArrials")}
                  </a>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <a href="/mywishlist" className="flex items-center space-x-1 px-2 py-1 relative">
            <Heart />
            <span className="text-sm">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </a>

          <a href="/mycart" className="flex items-center space-x-1 rounded-xl px-2 py-1 relative">
            <ShoppingCart />
            <span className="text-sm">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
          

          <a href="/myorders" className="flex items-center space-x-1 rounded-xl px-2 py-1">
            <DeliveryDiningOutlined />
            <span className="text-sm">My Orders</span>
          </a>

          {isLoggedIn ? (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger className="flex items-center space-x-2 px-3 py-1 rounded-full hover:bg-gray-200 focus:outline-none">
      <img
        src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
        alt="Account"
        className="w-8 h-8 rounded-full"
      />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
  className="absolute bg-white shadow-lg rounded-md mt-2 w-48 p-2 z-50"
  side="left"
  // align="end"
  sideOffset={105}
  // alignOffset={-10030} // 👈 move more to the left
>


        <a
          href="/myprofile"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
        >
          <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>Account</span>
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 space-x-2"
        >
          <LogIn className="text-red-600" size={18} />
          <span>Logout</span>
        </button>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
) : (
  <a
    href="/login"
    className="flex items-center justify-center space-x-1 bg-green-500 hover:bg-green-600 text-white rounded-xl px-5 py-2 text-lg font-semibold"
  >
    Login
  </a>
)}


        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
