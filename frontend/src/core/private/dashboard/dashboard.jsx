import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Side from '../../../components/sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      toast.error("Please LOGIN");
      navigate('/login', { replace: true });
    } else if (role === "user") {
      toast.error("Access denied: Admins only");
      navigate('/', { replace: true });
    }
  }, [navigate]);


  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    carts: 0,
    orders: 0
  });

  // Fetch dashboard stats (replace with your actual API call)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This is a mock API call - replace with your actual endpoint
        const response = await fetch('http://localhost:3000/api/admin/stats');
        const data = await response.json();
        setStats({
          users: data.users || 150,
          products: data.products || 75,
          carts: data.carts || 30,
          orders: data.orders || 45
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Bar chart data
  const barData = {
    labels: ['Users', 'Products', 'Carts', 'Orders'],
    datasets: [{
      label: 'Count',
      data: [stats.users, stats.products, stats.carts, stats.orders],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Pie chart data
  const pieData = {
    labels: ['Users', 'Products', 'Carts', 'Orders'],
    datasets: [{
      data: [stats.users, stats.products, stats.carts, stats.orders],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderColor: '#fff',
      borderWidth: 2
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Admin Dashboard Statistics'
      }
    }, radius: '59%'
  };

  return (
    <div className='flex overflow-hidden h-screen'>
      <Side />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-600">Total Users</h3>
            <p className="text-2xl font-bold">{stats.users}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-600">Products</h3>
            <p className="text-2xl font-bold">{stats.products}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-yellow-600">Carts</h3>
            <p className="text-2xl font-bold">{stats.carts}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-600">Orders</h3>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white p-4  rounded-lg shadow-md">
            <Bar data={barData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Overview Bar Chart' } }} />
          </div>
          <div className="bg-white p-4 h-full
           rounded-lg shadow-md">
            <Pie data={pieData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Distribution Pie Chart', } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;