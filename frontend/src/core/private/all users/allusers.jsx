import { Clipboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';
import { useGetUser } from './user_query';

function Users() {
    const navigate = useNavigate();

    // No localStorage/token/role check. Auth handled by backend via cookie.

    const { data: userList } = useGetUser();

    const handleCopy = async (text) => {
        if (!navigator.clipboard) {
            toast.error('Clipboard API not supported in your browser');
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard!');
        } catch (error) {
            console.error('Clipboard copy failed:', error);
            toast.error('Failed to copy');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#18181b]">
            <Side sidebarColor="#23232b" textColor="#fff" activeColor="#6366f1" />
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center mb-8 text-white tracking-tight">ALL USERS</h2>
                    <div className="bg-[#23232b] rounded-2xl shadow-xl p-6 border border-gray-800">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#18181b]">
                                        <th className="font-semibold px-6 py-4 text-left text-indigo-400 uppercase tracking-wider border-b border-gray-700">ID</th>
                                        <th className="font-semibold px-6 py-4 text-left text-emerald-400 uppercase tracking-wider border-b border-gray-700">Username</th>
                                        <th className="font-semibold px-6 py-4 text-left text-orange-400 uppercase tracking-wider border-b border-gray-700">Email</th>
                                        <th className="font-semibold px-6 py-4 text-left text-purple-400 uppercase tracking-wider border-b border-gray-700">Authority</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {userList?.data?.map((i) => (
                                        <tr key={i?._id} className="hover:bg-[#232346] transition-colors">
                                            <td className="px-6 py-4 text-white/90">
                                                <div className="flex items-center">
                                                    <span className="font-mono text-sm">{i?._id}</span>
                                                    <button
                                                        type="button"
                                                        className="ml-3 p-1 rounded-lg hover:bg-gray-700 transition-colors"
                                                        onClick={() => handleCopy(i?._id)}
                                                        data-testid={`copy-button-${i?._id}`}
                                                    >
                                                        <Clipboard size={16} className="text-gray-400 hover:text-indigo-400" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-emerald-300 font-medium">{i?.first_name}</td>
                                            <td className="px-6 py-4 text-orange-200">{i?.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    i?.role === 'admin' 
                                                        ? 'bg-purple-600 text-white' 
                                                        : 'bg-gray-600 text-gray-200'
                                                }`}>
                                                    {i?.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {(!userList?.data || userList.data.length === 0) && (
                            <div className="text-center py-12 text-gray-400">
                                No users found.
                            </div>
                        )}
                    </div>
                </div>
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
    );
}

export default Users;
