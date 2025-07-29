import { Clipboard } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';
import { useGetUser } from './user_query';

function Users() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate('/login', { replace: true });
        } else if (localStorage.getItem("role") === "user") {
            navigate('/', { replace: true });
        }
    }, [navigate]); // Add `navigate` to dependency array

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
        <div className="flex">
            <Side />
            <div className="text-3xl ml-8 w-full">
                <h2 className="font-semibold text-center mb-8 mt-8 text-blue-900">ALL USERS</h2>
                <div className="usertbl w-full bg-white shadow-lg rounded-lg p-6">
                    <table className="neumorphic w-full">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="font-medium px-4 py-2 border-b-2 border-blue-500">ID</th>
                                <th className="font-medium px-4 py-2 border-b-2 border-blue-500">Username</th>
                                <th className="font-medium px-4 py-2 border-b-2 border-blue-500">Email</th>
                                <th className="font-medium px-4 py-2 border-b-2 border-blue-500">Authority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList?.data?.map((i) => (
                                <tr key={i?._id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex items-center">
                                            {i?._id}
                                            <button
                                                type="button"
                                                className="ml-2"
                                                onClick={() => handleCopy(i?._id)}
                                                data-testid={`copy-button-${i?._id}`} // Add a unique test ID for each button

                                            >
                                                <Clipboard size={18} className="text-gray-600 hover:text-gray-800" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border-b">{i?.first_name}</td>
                                    <td className="px-4 py-2 border-b">{i?.email}</td>
                                    <td className="px-4 py-2 border-b">{i?.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                    theme="light"
                />
            </div>
        </div>
    );
}

export default Users;
