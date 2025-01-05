import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

const Profile = () => {
  const [user, setUser] = useState({
    // Initialize with empty arrays for collections
    contributedResources: [],
    savedResources: [],
    posts: [],
    reviews: [],
    bookmarks: [],
    username: '',
    email: '',
    img: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newImage, setNewImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/usersp/profile", {
        withCredentials: true
      });
      setUser(response.data);
      setNewUsername(response.data.username);
      setNewImage(response.data.img || '');
    } catch (err) {
      console.error('Fetch profile error:', err); // Add this for debugging
      setError(err.response?.data?.error || 'Failed to fetch profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:3000/usersp/profile", {
        username: newUsername,
        img: newImage
      });
      setUser(response.data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>No user data found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.img || 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png'}
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover"
          />
          
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="mt-4 w-full max-w-md">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username:
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Profile Image URL:
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 capitalize">Role: {user.role}</p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Contributed Resources</h3>
            <p>{user.contributedResources?.length || 0} resources</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Saved Resources</h3>
            <p>{user.savedResources?.length || 0} resources</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Posts</h3>
            <p>{user.posts?.length || 0} posts</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Reviews</h3>
            <p>{user.reviews?.length || 0} reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;