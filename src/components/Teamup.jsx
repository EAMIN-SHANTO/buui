import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TeamUp = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    skills: '',
    teamSize: '',
    deadline: ''
  });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      
      const response = await axios.get(`/api/teamup?${params}`);
      setPosts(response.data);
    } catch (error) {
      toast.error('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/teamup', newPost, {
        withCredentials: true
      });
      toast.success('Post created successfully!');
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating post');
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await axios.post(`/api/teamup/${postId}/bookmark`, {}, {
        withCredentials: true
      });
      toast.success('Bookmark toggled successfully');
      fetchPosts();
    } catch (error) {
      toast.error('Error toggling bookmark');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Up</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create Post
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="Project">Project</option>
          <option value="Competition">Competition</option>
          <option value="Thesis">Thesis</option>
          <option value="Programming">Programming</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Create Post Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Team Up Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full p-2 border rounded h-32"
                required
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="Project">Project</option>
                <option value="Competition">Competition</option>
                <option value="Thesis">Thesis</option>
                <option value="Programming">Programming</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Required Skills (comma-separated)"
                value={newPost.skills}
                onChange={(e) => setNewPost({...newPost, skills: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Team Size"
                value={newPost.teamSize}
                onChange={(e) => setNewPost({...newPost, teamSize: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={newPost.deadline}
                onChange={(e) => setNewPost({...newPost, deadline: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="border rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-gray-600">Posted by {post.user.username}</p>
                </div>
                <button
                  onClick={() => handleBookmark(post._id)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  {post.bookmarks.includes(currentUser?._id) ? '★' : '☆'}
                </button>
              </div>
              <div className="mt-2">
                <p>{post.content}</p>
                {post.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                  {post.teamSize && <span>Team Size: {post.teamSize} • </span>}
                  {post.deadline && (
                    <span>
                      Deadline: {new Date(post.deadline).toLocaleDateString()} • 
                    </span>
                  )}
                  <span>{post.comments.length} comments</span>
                </div>
                <span>{post.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamUp; 