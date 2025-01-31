import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import.meta.env
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const CurrentTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, tech, academic, research

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await axios.get('VITE_API_URL/api/trends');
      setTrends(response.data);
    } catch (error) {
      toast.error('Error fetching trends');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrends = trends.filter(trend => {
    if (filter === 'all') return true;
    return trend.category === filter;
  });

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'tech', label: 'Tech News' },
    { id: 'academic', label: 'Academic Updates' },
    { id: 'research', label: 'Research News' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trends & News</h1>
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrends.map((trend) => (
              <div
                key={trend._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {trend.image && (
                  <img
                    src={trend.image}
                    alt={trend.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      trend.category === 'tech' 
                        ? 'bg-purple-100 text-purple-800'
                        : trend.category === 'academic'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {trend.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(trend.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {trend.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {trend.description}
                  </p>
                  {trend.url && (
                    <a
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Read More
                      <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </a>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex items-center gap-2">
                    <img
                      src={trend.user?.avatar || DEFAULT_AVATAR}
                      alt={trend.user?.username || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {trend.user?.username || 'Anonymous User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trend.user?.role || 'Member'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTrends.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-4xl text-gray-400">
              search_off
            </span>
            <p className="mt-2 text-gray-600">
              No trends found for this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentTrends;
