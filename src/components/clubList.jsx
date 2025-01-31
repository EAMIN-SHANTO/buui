import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import.meta.env
const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/clubs`);
      setClubs(response.data);
    } catch (error) {
      toast.error('Error fetching clubs');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Clubs' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'technical', label: 'Technical' },
    { id: 'sports', label: 'Sports' },
    { id: 'social', label: 'Social' }
  ];

  const filteredClubs = clubs.filter(club => {
    if (filter === 'all') return true;
    return club.category === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BRACU Clubs</h1>
            <p className="mt-2 text-gray-600">Discover and join student organizations at BRAC University</p>
          </div>
          <div className="flex flex-wrap gap-2">
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
            {filteredClubs.map((club) => (
              <div
                key={club._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={club.image?.startsWith('http') 
                      ? club.image 
                      : `VITE_API_URL${club.image}`}
                    alt={club.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = 'https://via.placeholder.com/400x200?text=Club+Image';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      club.category === 'cultural' ? 'bg-purple-100 text-purple-800' :
                      club.category === 'technical' ? 'bg-blue-100 text-blue-800' :
                      club.category === 'sports' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {club.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {club.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {club.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-gray-400">people</span>
                      <span className="text-sm text-gray-600">{club.memberCount || '0'} members</span>
                    </div>
                    <a
                      href={club.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      Join Club
                      <span className="material-icons text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-gray-400">mail</span>
                        <a href={`mailto:${club.email}`} className="text-sm text-gray-600 hover:text-blue-600">
                          Contact
                        </a>
                      </div>
                      {club.socialLinks?.facebook && (
                        <a
                          href={club.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <span className="material-icons">facebook</span>
                        </a>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      Est. {new Date(club.establishedDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-4xl text-gray-400">
              groups_off
            </span>
            <p className="mt-2 text-gray-600">
              No clubs found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubList;
