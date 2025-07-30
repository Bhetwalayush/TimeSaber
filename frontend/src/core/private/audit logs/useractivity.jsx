import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowBack, 
  Person, 
  CalendarToday, 
  LocationOn,
  Timeline,
  Refresh,
  Download
} from '@mui/icons-material';
import Side from '../../../components/sidebar';

const UserActivity = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userActivity, setUserActivity] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActions: 0,
    lastActivity: null,
    mostFrequentAction: '',
    uniqueIPs: 0
  });

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

  useEffect(() => {
    if (userId) {
      fetchUserActivity();
    }
  }, [userId]);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`https://localhost:3000/api/admin/audit/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user activity');
      }

      const data = await response.json();
      setUserActivity(data.activities || []);
      setUserInfo(data.userInfo);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error('Failed to load user activity');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`https://localhost:3000/api/admin/audit/user/${userId}/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export user activity');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-activity-${userId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('User activity exported successfully');
    } catch (error) {
      console.error('Error exporting user activity:', error);
      toast.error('Failed to export user activity');
    }
  };

  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'logout':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      case 'add_to_cart':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case 'remove_from_cart':
        return <div className="w-3 h-3 bg-orange-500 rounded-full"></div>;
      case 'update_cart':
        return <div className="w-3 h-3 bg-purple-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'border-green-200 bg-green-50';
      case 'logout':
        return 'border-red-200 bg-red-50';
      case 'add_to_cart':
        return 'border-blue-200 bg-blue-50';
      case 'remove_from_cart':
        return 'border-orange-200 bg-orange-50';
      case 'update_cart':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
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


  return (
    <div className='flex overflow-hidden h-screen'>
      <Side />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/auditlogs')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg"
              >
                <ArrowBack />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">User Activity</h1>
                <p className="text-gray-600">Detailed activity timeline for user</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={fetchUserActivity}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Refresh className="mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user activity...</p>
          </div>
        ) : (
          <>
            {/* User Info Card */}
            {userInfo && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Person className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {renderUserName(userInfo?.name)}
                    </h2>
                    <p className="text-gray-600">User ID: {userId}</p>
                    <p className="text-gray-600">Email: {userInfo.email || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="font-medium">
                      {userInfo.createdAt ? formatDate(userInfo.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Timeline className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Actions</p>
                    <p className="text-2xl font-bold">{stats.totalActions}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CalendarToday className="text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Last Activity</p>
                    <p className="text-lg font-bold">
                      {stats.lastActivity ? formatRelativeTime(stats.lastActivity) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Person className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Most Frequent</p>
                    <p className="text-lg font-bold">
                      {stats.mostFrequentAction ? stats.mostFrequentAction.replace(/_/g, ' ') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <LocationOn className="text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Unique IPs</p>
                    <p className="text-2xl font-bold">{stats.uniqueIPs}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Activity Timeline</h3>
              </div>

              {userActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No activity found for this user</p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {userActivity.map((activity, index) => (
                      <div key={activity._id} className="relative mb-6">
                        {/* Timeline dot */}
                        <div className="absolute left-4 top-4 w-4 h-4 bg-white border-2 border-gray-300 rounded-full z-10">
                          {getActionIcon(activity.action)}
                        </div>
                        
                        {/* Activity card */}
                        <div className={`ml-12 p-4 rounded-lg border ${getActionColor(activity.action)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">
                                  {activity.action.replace(/_/g, ' ')}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatRelativeTime(activity.timestamp)}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-2">
                                {renderDetails(activity.details)}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <LocationOn className="w-4 h-4 mr-1" />
                                  {activity.ipAddress}
                                </div>
                                <div className="flex items-center">
                                  <CalendarToday className="w-4 h-4 mr-1" />
                                  {formatDate(activity.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserActivity; 