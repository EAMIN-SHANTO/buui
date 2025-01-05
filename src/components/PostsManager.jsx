import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostsManager = () => {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts', {
        withCredentials: true
      });
      setPosts(response.data);
    } catch (error) {
      toast.error('Error fetching posts');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:3000/posts/${postId}`, {
          withCredentials: true
        });
        toast.success('Post deleted successfully');
        fetchPosts();
      } catch (error) {
        toast.error('Error deleting post');
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Author</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post._id}>
              <td className="border px-4 py-2">{post.title}</td>
              <td className="border px-4 py-2">{post.author?.username}</td>
              <td className="border px-4 py-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <a
                  href={`/post/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-2 py-1 rounded inline-block"
                >
                  View
                </a>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostsManager; 