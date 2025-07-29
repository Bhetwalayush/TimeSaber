import { DollarSign, Image as ImageIcon, Package, Plus, ShoppingBag, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';
import { useSaveItem } from './query';

function Additems() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/login', { replace: true });
        } else if (localStorage.getItem("role") === "user") {
            navigate('/', { replace: true });
        }
    }, []);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const saveApi = useSaveItem();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Main Categories and Their Subcategories
    const subOptions = {
        "timesaber": ["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
        "Prada": ["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
        "Puma":["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
        "Gucci":["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
        "Louis Vuitton":["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
        "Nike":["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
        "Michael Kors":["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
        "Coach":["Our Favorites", "Women Watch", "Men Watch", "Popular", "New Arrials", "Price:Low to High", "Price:High to Low"],
    };

    // Handle Main Category Change
    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        setValue("item_type", selectedValue);
        setValue("sub_item_type", "");
    };

    // Handle Image Upload
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Form Submission
    const onSubmit = async (data) => {
        if (!data.item_type || !data.sub_item_type) {
            toast.error("Please select a category and subcategory!");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('item_name', data?.item_name);
        formData.append('description', data?.description);
        formData.append('item_quantity', data?.item_quantity);
        formData.append('item_price', data?.item_price);
        formData.append('image', data?.image[0]);
        formData.append('item_type', data.item_type);
        formData.append('sub_item_type', data.sub_item_type);

        try {
            await saveApi.mutate(formData);
            toast.success("Product added successfully!");
            // Reset form
            setValue("item_name", "");
            setValue("description", "");
            setValue("item_quantity", "");
            setValue("item_price", "");
            setValue("image", "");
            setValue("item_type", "");
            setValue("sub_item_type", "");
            setSelectedCategory("");
            setImagePreview(null);
        } catch (error) {
            toast.error("Failed to add product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
            <div className="flex-shrink-0">
                <Side />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header - Reduced spacing */}
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-2">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Add New Product</h1>
                        <p className="text-sm text-gray-600">Create a new watch listing for TimeSaber</p>
                    </div>

                    {/* Form Card - Reduced padding */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Product Information Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-lg font-semibold text-gray-800">Product Information</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
                                            type="text"
                                            placeholder="e.g., Luxury Leather Handbag"
                                            {...register("item_name", { required: "Product name is required" })}
                                        />
                                        {errors.item_name && <p className="text-red-500 text-xs mt-1">{errors.item_name.message}</p>}
                                    </div>
                                    
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm resize-none text-sm"
                                            rows="3"
                                            placeholder="Describe your product's features, materials, and unique selling points..."
                                            {...register("description", { required: "Description is required" })}
                                        />
                                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <ImageIcon className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-lg font-semibold text-gray-800">Product Image</h3>
                                </div>
                                
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            type="file"
                                            accept="image/*"
                                            {...register("image", { required: "Product image is required" })}
                                            onChange={handleImageChange}
                                        />
                                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                                    </div>
                                    
                                    {imagePreview && (
                                        <div className="flex-shrink-0">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Preview</p>
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing & Inventory Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
                                            type="number"
                                            min="1"
                                            placeholder="Available quantity"
                                            {...register("item_quantity", { required: "Quantity is required", min: 1 })}
                                        />
                                        {errors.item_quantity && <p className="text-red-500 text-xs mt-1">{errors.item_quantity.message}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Price per item"
                                            {...register("item_price", { required: "Price is required", min: 0 })}
                                        />
                                        {errors.item_price && <p className="text-red-500 text-xs mt-1">{errors.item_price.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Plus className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-lg font-semibold text-gray-800">Category</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <select
                                            {...register("item_type", { required: "Brand is required" })}
                                            onChange={handleCategoryChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
                                        >
                                            <option value="">Select Brand</option>
                                            {Object.keys(subOptions).map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        {errors.item_type && <p className="text-red-500 text-xs mt-1">{errors.item_type.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                                        <select
                                            {...register("sub_item_type", { required: "Product type is required" })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
                                            enabled={!selectedCategory}
                                        >
                                            <option value="">Select Product Type</option>
                                            {selectedCategory && subOptions[selectedCategory]?.map((sub) => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                        {errors.sub_item_type && <p className="text-red-500 text-xs mt-1">{errors.sub_item_type.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    {isLoading ? "Adding..." : "Add Product"}
                                </button>

                                <button
                                    type="reset"
                                    onClick={() => {
                                        setSelectedCategory("");
                                        setImagePreview(null);
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default Additems;