import { Facebook, Globe, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Brand & Description */}
          <div className="col-span-1">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white font-bold text-xl">TS</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">TimeSaber</h3>
                <p className="text-sm text-gray-300">Precision in Every Moment</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              TimeSaber brings you an exquisite collection of premium watches that blend timeless elegance with modern innovation. From luxury timepieces to everyday companions, discover the perfect watch that speaks to your style and sophistication.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400 mr-3" />
                <span>Dillibazaar-29, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-indigo-400 mr-3" />
                <span>timesaber@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-indigo-400 mr-3" />
                <span>+977 9876543210</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 hover:scale-110">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 hover:scale-110">
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 hover:scale-110">
                <Globe className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 hover:scale-110">
                <Instagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-xl font-semibold text-white mb-8">Company</h4>
            <ul className="space-y-4">
              <li>
                <a href="/FAQ" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/myorders" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/contactus" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/contactus" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Support Center
                </a>
              </li>
            </ul>
          </div>

          {/* Category */}
          <div className="col-span-1">
            <h4 className="text-xl font-semibold text-white mb-8">Collections</h4>
            <ul className="space-y-4">
              <li>
                <a href="/newarrivals" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/popular" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Popular Watches
                </a>
              </li>
              <li>
                <a href="/womenwatch" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Women's Collection
                </a>
              </li>
              <li>
                <a href="/menwatch" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Men's Collection
                </a>
              </li>
              <li>
                <a href="/ourfavorites" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Our Favorites
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Luxury Timepieces
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-xl font-semibold text-white mb-8">Stay Connected</h4>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Subscribe to TimeSaber for exclusive watch releases, special offers, and insider updates from TimeSaber.
            </p>
            <div className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <p>Get 10% off your first order</p>
              <p className="mt-1">Free shipping on orders over Rs.100</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            © 2025 TimeSaber. All rights reserved. | Crafted with precision for watch enthusiasts worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;