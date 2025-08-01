import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Side from '../../../components/sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  // No localStorage/token/role check. Auth handled by backend via cookie.

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    carts: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://localhost:3000/api/admin/stats', {
          credentials: 'include',
        });
        if (response.status === 401 || response.status === 403) {
          toast.error("Access denied: Admins only");
          navigate('/login', { replace: true });
          return;
        }
        const data = await response.json();
        setStats({
          users: data.users || 150,
          products: data.products || 75,
          carts: data.carts || 30,
          orders: data.orders || 45
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error("Failed to fetch dashboard stats");
      }
    };
    fetchStats();
  }, [navigate]);

  const barData = {
    labels: ['Users', 'Products', 'Carts', 'Orders'],
    datasets: [{
      label: 'Count',
      data: [stats.users, stats.products, stats.carts, stats.orders],
      backgroundColor: [
        '#6366f1', // indigo
        '#10b981', // emerald
        '#f59e42', // orange
        '#a78bfa'  // purple
      ],
      borderColor: [
        '#6366f1',
        '#10b981',
        '#f59e42',
        '#a78bfa'
      ],
      borderWidth: 2
    }]
  };

  const pieData = {
    labels: ['Users', 'Products', 'Carts', 'Orders'],
    datasets: [{
      data: [stats.users, stats.products, stats.carts, stats.orders],
      backgroundColor: [
        '#6366f1',
        '#10b981',
        '#f59e42',
        '#a78bfa'
      ],
      borderColor: '#18181b',
      borderWidth: 2
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#fff' }
      },
      title: {
        display: true,
        text: 'Admin Dashboard Statistics',
        color: '#fff',
        font: { size: 18 }
      }
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: '#27272a' } },
      y: { ticks: { color: '#fff' }, grid: { color: '#27272a' } }
    },
    radius: '59%'
  };

  return (
    <div className="flex overflow-hidden h-screen bg-[#18181b]">
      <Side sidebarColor="#23232b" textColor="#fff" activeColor="#6366f1" />
      <div className="flex-1 p-8 bg-[#18181b] min-h-screen">
        <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white/80">Total Users</h3>
            <p className="text-3xl font-extrabold text-white mt-2">{stats.users}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 rounded-2xl shadow-lg flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white/80">Products</h3>
            <p className="text-3xl font-extrabold text-white mt-2">{stats.products}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-2xl shadow-lg flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white/80">Carts</h3>
            <p className="text-3xl font-extrabold text-white mt-2">{stats.carts}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl shadow-lg flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white/80">Orders</h3>
            <p className="text-3xl font-extrabold text-white mt-2">{stats.orders}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#23232b] p-6 rounded-2xl shadow-lg">
            <Bar data={barData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Overview Bar Chart' } } }} />
          </div>
          <div className="bg-[#23232b] p-6 rounded-2xl shadow-lg">
            <Pie data={pieData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Distribution Pie Chart' } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;