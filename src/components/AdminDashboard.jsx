import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ResourcesManager from './ResourcesManager';
import PostsManager from './PostsManager';
import { ActivityLineChart, UserDistributionChart } from './AdminCharts';
import.meta.env
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalResources: 0,
    totalPosts: 0,
    recentActivity: [],
    activityData: [],
    userDistribution: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'low'
  });
  const [clubs, setClubs] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'overview':
          const statsResponse = await axios.get('VITE_API_URL/api/admin/stats', {
            withCredentials: true
          });
          setStats({
            ...statsResponse.data,
            recentActivity: statsResponse.data.recentActivity || [],
            activityData: statsResponse.data.activityData || [],
            userDistribution: statsResponse.data.userDistribution || []
          });
          break;
        case 'users':
          const usersResponse = await axios.get('VITE_API_URL/api/admin/users', {
            withCredentials: true
          });
          setUsers(usersResponse.data);
          break;
        case 'announcements':
          const announcementsResponse = await axios.get('VITE_API_URL/api/announcements', {
            withCredentials: true
          });
          setStats(prev => ({
            ...prev,
            announcements: announcementsResponse.data
          }));
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'clubs') {
      fetchClubs();
    }
  }, [activeTab]);

  const fetchClubs = async () => {
    try {
      const response = await axios.get('VITE_API_URL/clubs');
      setClubs(response.data);
    } catch (error) {
      toast.error('Error fetching clubs');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`VITE_API_URL/api/admin/users/${userId}/role`, 
        { role: newRole },
        { withCredentials: true }
      );
      toast.success('User role updated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Error updating user role');
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('VITE_API_URL/api/announcements', newAnnouncement, {
        withCredentials: true
      });
      toast.success('Announcement created successfully');
      setNewAnnouncement({ title: '', content: '', priority: 'low' });
      fetchDashboardData();
    } catch (error) {
      toast.error('Error creating announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`VITE_API_URL/api/announcements/${id}`, {
        withCredentials: true
      });
      toast.success('Announcement deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Error deleting announcement');
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;

    try {
      await axios.delete(`VITE_API_URL/clubs/${clubId}`, {
        withCredentials: true
      });
      toast.success('Club deleted successfully');
      fetchClubs(); // Refresh the list
    } catch (error) {
      toast.error('Error deleting club');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="group"
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon="article"
          color="green"
          trend="+5%"
        />
        <StatCard
          title="Resources"
          value={stats.totalResources}
          icon="folder"
          color="yellow"
          trend="+8%"
        />
        <StatCard
          title="Events"
          value={stats.totalEvents}
          icon="event"
          color="purple"
          trend="+15%"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <ActivityLineChart data={stats.activityData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <UserDistributionChart data={stats.userDistribution} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">User Management</h3>
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                      className="px-3 py-1 border rounded-lg"
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Create Announcement</h3>
        <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement(prev => ({
                ...prev,
                title: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement(prev => ({
                ...prev,
                content: e.target.value
              }))}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={newAnnouncement.priority}
              onChange={(e) => setNewAnnouncement(prev => ({
                ...prev,
                priority: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Announcement
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
        <div className="space-y-4">
          {stats.announcements?.map((announcement) => (
            <div key={announcement._id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-gray-600 mt-1">{announcement.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      announcement.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : announcement.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClubs = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clubs.map((club) => (
              <tr key={club._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={club.image?.startsWith('http') 
                          ? club.image 
                          : `VITE_API_URL${club.image}`}
                        alt={club.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/40?text=Club';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {club.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {club.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    club.category === 'cultural' ? 'bg-purple-100 text-purple-800' :
                    club.category === 'technical' ? 'bg-blue-100 text-blue-800' :
                    club.category === 'sports' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {club.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {club.memberCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    club.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {club.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteClub(club._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon="dashboard"
            label="Overview"
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            icon="group"
            label="Users"
          />
          <TabButton
            active={activeTab === 'resources'}
            onClick={() => setActiveTab('resources')}
            icon="folder"
            label="Resources"
          />
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            icon="article"
            label="Posts"
          />
          <TabButton
            active={activeTab === 'announcements'}
            onClick={() => setActiveTab('announcements')}
            icon="campaign"
            label="Announcements"
          />
          <TabButton
            active={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
            icon="event"
            label="Events"
          />
          <TabButton
            active={activeTab === 'clubs'}
            onClick={() => setActiveTab('clubs')}
            icon="group"
            label="Clubs"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'resources' && <ResourcesManager />}
              {activeTab === 'posts' && <PostsManager />}
              {activeTab === 'announcements' && renderAnnouncements()}
              {activeTab === 'events' && <EventsManager />}
              {activeTab === 'clubs' && renderClubs()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h4 className="text-2xl font-bold mt-2">{value}</h4>
      </div>
      <span className={`material-icons text-${color}-500 text-xl`}>{icon}</span>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`text-${color}-500 text-sm`}>{trend}</span>
      <span className="text-gray-500 text-sm ml-2">vs last month</span>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
  >
    <span className="material-icons text-sm">{icon}</span>
    {label}
  </button>
);

const ActivityItem = ({ activity }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
    <span className="material-icons text-gray-500">{activity.icon}</span>
    <div>
      <p className="text-sm font-medium">{activity.message}</p>
      <p className="text-xs text-gray-500">{activity.time}</p>
    </div>
  </div>
);

export default AdminDashboard; 