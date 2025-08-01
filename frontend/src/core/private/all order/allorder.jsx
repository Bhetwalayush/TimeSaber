import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';

function Allorder() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // No localStorage/token/role check. Auth handled by backend via cookie.

    // Fetch all orders
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://localhost:3000/api/order', {
                withCredentials: true,
            });
            setItems(response.data || []);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error("Access denied: Admins only");
                navigate('/login', { replace: true });
            } else {
                console.error('Error fetching orders:', error.response?.data || error.message);
                setItems([]);
            }
        }
    };

    // Delete order
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:3000/api/order/${id}`, {
                withCredentials: true,
            });
            setItems(items.filter((item) => item._id !== id));
            toast.success('Order deleted successfully');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error("Access denied: Admins only");
                navigate('/login', { replace: true });
            } else {
                console.error('Error deleting order:', error.response?.data || error.message);
                toast.error(error.response?.data?.message || 'Failed to delete order');
            }
        }
    };

    // Show order items in modal
    const showOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="flex min-h-screen bg-[#18181b]">
            <Side sidebarColor="#23232b" textColor="#fff" activeColor="#6366f1" />

            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-white text-center mb-10 tracking-tight">ALL ORDERS</h2>

                    <div className="bg-[#23232b] rounded-2xl shadow-xl p-6 border border-gray-800">
                        {items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#18181b]">
                                            <th className="p-4 font-semibold text-sm uppercase text-indigo-400 tracking-wider border-b border-gray-700">Order ID</th>
                                            <th className="p-4 font-semibold text-sm uppercase text-emerald-400 tracking-wider border-b border-gray-700">User</th>
                                            <th className="p-4 font-semibold text-sm uppercase text-orange-400 tracking-wider border-b border-gray-700">Items</th>
                                            <th className="p-4 font-semibold text-sm uppercase text-purple-400 tracking-wider border-b border-gray-700">Address</th>
                                            <th className="p-4 font-semibold text-sm uppercase text-gray-300 tracking-wider border-b border-gray-700">Phone No</th>
                                            <th className="p-4 font-semibold text-sm uppercase text-red-400 tracking-wider border-b border-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {items.map((item) => (
                                            <tr
                                                key={item._id}
                                                className="hover:bg-[#232346] transition-colors"
                                            >
                                                <td className="p-4 text-white/90 font-mono text-sm break-all">{item._id}</td>
                                                <td className="p-4 text-emerald-300 break-all">{item.userId || "N/A"}</td>
                                                <td
                                                    className="p-4 text-orange-300 break-all cursor-pointer hover:text-orange-200 transition-colors"
                                                    onClick={() => showOrderDetails(item)}
                                                >
                                                    View Items
                                                </td>
                                                <td className="p-4 text-purple-200">{item.address || "N/A"}</td>
                                                <td className="p-4 text-gray-300">{item.phone_no || "N/A"}</td>
                                                <td className="p-4">
                                                    <button
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                                        onClick={() => handleDelete(item._id)}
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                No orders found
                            </div>
                        )}
                    </div>

                    {showModal && selectedOrder && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-[#23232b] rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-800 shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-white">
                                        Order Items (ID: {selectedOrder._id})
                                    </h3>
                                    <button
                                        className="text-gray-400 hover:text-white text-2xl p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                        onClick={() => setShowModal(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-[#18181b]">
                                                    <th className="p-4 font-semibold text-sm text-indigo-400 border-b border-gray-700">Item Name</th>
                                                    <th className="p-4 font-semibold text-sm text-emerald-400 border-b border-gray-700">Quantity</th>
                                                    <th className="p-4 font-semibold text-sm text-orange-400 border-b border-gray-700">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800">
                                                {selectedOrder.items.map((item) => (
                                                    <tr key={item._id || item.itemId} className="hover:bg-[#232346] transition-colors">
                                                        <td className="p-4 text-white/90">
                                                            {item.item_name || "N/A"}
                                                        </td>
                                                        <td className="p-4 text-emerald-300">
                                                            {item.quantity || 0}
                                                        </td>
                                                        <td className="p-4 text-orange-300">
                                                            Rs.{item.item_price || "N/A"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 py-8">No items in this order</p>
                                )}
                            </div>
                        </div>
                    )}

                    <ToastContainer
                        position="top-right"
                        autoClose={2500}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </div>
            </div>
        </div>
    );
}

export default Allorder;