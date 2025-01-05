import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      toast.error('Error fetching announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Announcements</h2>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div 
            key={announcement._id} 
            className={`border p-4 rounded-lg ${
              announcement.priority === 'high' 
                ? 'border-red-200 bg-red-50'
                : announcement.priority === 'medium'
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            <h3 className="font-semibold text-lg">{announcement.title}</h3>
            <p className="mt-2 text-gray-600">{announcement.content}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>By {announcement.user.username}</span>
              <span>•</span>
              <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{announcement.priority} Priority</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements; 