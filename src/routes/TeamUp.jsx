import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';

const TeamUp = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    skills: '',
    teamSize: '',
    deadline: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Separate useEffect for user fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get('http://localhost:3000/usersp/profile', {
          withCredentials: true
        });
        setCurrentUser(userResponse.data);
        
        const postsResponse = await axios.get('http://localhost:3000/api/teamup', {
          withCredentials: true
        });
        setPosts(postsResponse.data);
        localStorage.setItem('allPosts', JSON.stringify(postsResponse.data));
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Separate effect for filtering posts
  useEffect(() => {
    if (posts.length > 0 && filter === 'my-posts' && currentUser) {
      const originalPosts = JSON.parse(localStorage.getItem('allPosts') || '[]');
      const filteredPosts = filter === 'my-posts' 
        ? originalPosts.filter(post => post.user?._id === currentUser?._id)
        : originalPosts;
      setPosts(filteredPosts);
    }
  }, [filter, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/teamup', newPost, {
        withCredentials: true
      });
      
      // Add the new post to the existing posts array
      setPosts(prevPosts => [response.data, ...prevPosts]);
      
      // Reset form and close modal
      setNewPost({
        title: '',
        content: '',
        category: '',
        skills: '',
        teamSize: '',
        deadline: ''
      });
      setShowForm(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Error creating post');
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await axios.post(`http://localhost:3000/api/teamup/${postId}/bookmark`, {}, {
        withCredentials: true
      });
      toast.success('Bookmark toggled successfully');
      fetchPosts();
    } catch (error) {
      toast.error('Error toggling bookmark');
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/teamup/${postId}/comments`, {
        withCredentials: true
      });
      setComments(response.data);
    } catch (error) {
      toast.error('Error fetching comments');
    }
  };

  const handleAddComment = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/teamup/${postId}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      
      // Update the posts state with the new post data
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
      
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/teamup/${postId}/comments/${commentId}`,
        { withCredentials: true }
      );
      fetchComments(postId);
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Error deleting comment');
    }
  };

  const CommentWithReplies = ({ comment, post }) => {
    // Add local state for this specific comment's reply
    const [isReplying, setIsReplying] = useState(false);
    const [localReplyContent, setLocalReplyContent] = useState('');

    const handleReplySubmit = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/teamup/${post._id}/comments/${comment._id}/reply`,
          { content: localReplyContent },
          { withCredentials: true }
        );
        
        // Update the posts state with the new post data
        setPosts(posts.map(p => 
          p._id === post._id ? response.data : p
        ));
        
        setLocalReplyContent('');
        setIsReplying(false);
        toast.success('Reply added successfully');
      } catch (error) {
        console.error('Error adding reply:', error);
        toast.error('Error adding reply');
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start bg-gray-50 p-2 rounded">
          <div>
            <p className="font-medium">{comment.user?.username}</p>
            <p className="text-gray-600">{comment.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
            {currentUser && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-blue-500 text-sm hover:text-blue-700 mt-1"
              >
                {isReplying ? 'Cancel Reply' : 'Reply'}
              </button>
            )}
          </div>
          {currentUser?._id === comment.user?._id && (
            <button
              onClick={() => handleDeleteComment(post._id, comment._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="ml-8 flex gap-2 mb-2">
            <input
              type="text"
              value={localReplyContent}
              onChange={(e) => setLocalReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleReplySubmit}
              disabled={!localReplyContent.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Reply
            </button>
            <button
              onClick={() => {
                setIsReplying(false);
                setLocalReplyContent('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="ml-8 space-y-2">
            {comment.replies.map((reply) => (
              <div key={reply._id} className="flex justify-between items-start bg-gray-100 p-2 rounded">
                <div>
                  <p className="font-medium">{reply.user?.username}</p>
                  <p className="text-gray-600">{reply.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {currentUser?._id === reply.user?._id && (
                  <button
                    onClick={() => handleDeleteComment(post._id, reply._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">BRACUverse <sub>/ FORUMS</sub></h1>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Post
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
              {/* Post Type Filter */}
              <div className="flex gap-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded ${
                    filter === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  All Posts
                </button>
                <button
                  onClick={() => setFilter('my-posts')}
                  className={`px-4 py-2 rounded ${
                    filter === 'my-posts' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  My Posts
                </button>
              </div>

              {/* Category Filter */}
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

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {filter === 'my-posts' 
                    ? "You haven't created any posts yet" 
                    : "No posts available"}
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="border rounded-lg p-6 hover:shadow-lg transition bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-blue-600">{post.title}</h2>
                        <p className="text-gray-600">
                          Posted by {post.user?.username} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {currentUser && (
                        <button
                          onClick={() => handleBookmark(post._id)}
                          className="text-2xl text-gray-500 hover:text-blue-500"
                        >
                          {post.bookmarks?.includes(currentUser._id) ? '★' : '☆'}
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-700">{post.content}</p>
                      
                      {post.skills?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      {post.teamSize && (
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                          <span>Team Size: {post.teamSize}</span>
                        </div>
                      )}
                      {post.deadline && (
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>Deadline: {new Date(post.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span>💬</span>
                        <span>{post.comments?.length || 0} comments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{post.views || 0} views</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-sm ${
                        post.status === 'Open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {post.status}
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4 border-t pt-4">
                      <h3 className="font-bold mb-2">Comments ({post.comments?.length || 0})</h3>
                      
                      {/* Add Comment Form */}
                      {currentUser && (
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 p-2 border rounded"
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                          >
                            Comment
                          </button>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-2">
                        {post.comments && post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <CommentWithReplies 
                              key={comment._id} 
                              comment={comment} 
                              post={post} 
                            />
                          ))
                        ) : (
                          <p className="text-gray-500 text-center">No comments yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Create Post Modal */}
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
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TeamUp; 