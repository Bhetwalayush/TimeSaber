import React, { useEffect, useState } from 'react';
import Side from '../../../components/sidebar';

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

const renderDetails = (details) => {
  if (!details) return '';
  if (typeof details === 'string') return details;
  return JSON.stringify(details);
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://localhost:3000/api/admin/audit/logs', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
      })
      .then(data => setLogs(data.logs || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#18181b]">
      <Side sidebarColor="#23232b" textColor="#fff" activeColor="#6366f1" />
      <main className="flex-1 flex flex-col items-center justify-start p-8 bg-[#18181b]">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">Audit Logs</h1>
          <div className="bg-[#23232b] rounded-2xl shadow-lg p-6">
            {loading && <div className="p-8 text-center text-white/80">Loading audit logs...</div>}
            {error && <div className="p-8 text-center text-red-400 font-semibold">{error}</div>}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#18181b]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-orange-400 uppercase tracking-wider">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">IP</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#23232b] divide-y divide-gray-800">
                    {logs.map(log => (
                      <tr key={log._id} className="hover:bg-[#232346] transition-colors">
                        <td className="px-4 py-3 text-white/90">{renderUserName(log.userName)}</td>
                        <td className="px-4 py-3 text-emerald-300 font-semibold">{log.action}</td>
                        <td className="px-4 py-3 text-orange-200">{renderDetails(log.details)}</td>
                        <td className="px-4 py-3 text-purple-200">{log.ipAddress}</td>
                        <td className="px-4 py-3 text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length === 0 && (
                  <div className="p-8 text-center text-gray-400">No audit logs found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 