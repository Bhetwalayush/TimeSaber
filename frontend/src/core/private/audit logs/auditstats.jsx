import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import Side from '../../../components/sidebar';
const AuditStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    overview: {
      totalLogs: 0,
      todayLogs: 0,
      uniqueUsers: 0,
      totalActions: 0
    },
    actionBreakdown: [],
    hourlyActivity: [],
    userActivity: [],
    topUsers: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // No localStorage/token/role check. Auth handled by backend via cookie.

  useEffect(() => {
    fetchAuditStats();
  }, [timeRange]);

  const fetchAuditStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:3000/api/admin/audit/stats?timeRange=${timeRange}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 401 || response.status === 403) {
        toast.error('Access denied: Admins only');
        navigate('/login', { replace: true });
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch audit statistics');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching audit statistics:', error);
      toast.error('Failed to load audit statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`https://localhost:3000/api/admin/audit/stats/export?timeRange=${timeRange}`, {
        credentials: 'include',
      });
      if (response.status === 401 || response.status === 403) {
        toast.error('Access denied: Admins only');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to export audit statistics');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-stats-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Audit statistics exported successfully');
    } catch (error) {
      console.error('Error exporting audit statistics:', error);
      toast.error('Failed to export audit statistics');
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (hour) => {
    return `${hour}:00`;
  };

  // Utility to render userName as a string
  const renderUserName = (userName) => {
    if (!userName) return 'Unknown User';
    if (typeof userName === 'string') return userName;
    if (typeof userName === 'object') {
      if (userName.first_name || userName.last_name) {
        return `${userName.first_name || ''} ${userName.last_name || ''}`.trim();
      }
      if (userName.email) return userName.email;
      return JSON.stringify(userName);
    }
    return String(userName);
  };

  // Utility to render details as a string
  const renderDetails = (details) => {
    if (!details) return '';
    if (typeof details === 'string') return details;
    return JSON.stringify(details);
  };

  // 🔧 Fix: map userName to string for chart compatibility
  const userActivityData = stats.userActivity.map((entry) => ({
    ...entry,
    userName: renderUserName(entry.userName),
  }));

  return (
    <div className='flex overflow-hidden h-screen'>
      <Side />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Header section and Overview Cards remain unchanged */}

        {/* ... skipped for brevity ... */}

        {/* User Activity Bar Chart (with fix) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">User Activity (Top 10)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="userName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activityCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ... Top Users Table and Recent Activity stay the same ... */}
        </div>
      </div>
    </div>
  );
};

export default AuditStats;