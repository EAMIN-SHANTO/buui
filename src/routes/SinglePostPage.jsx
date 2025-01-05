import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "../components/Image";
import { Link, useNavigate } from "react-router-dom";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";
import Search from "../components/Search";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const SinglePostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    desc: '',
    content: '',
  });

  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
      return response.data;
    }
  });

  useEffect(() => {
    fetchCurrentUser();
    if (post) {
      setEditForm({
        title: post.title,
        desc: post.desc,
        content: post.content,
      });
    }
  }, [post]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usersp/profile', {
        withCredentials: true
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const canModifyPost = () => {
    return currentUser && (
      currentUser.role === 'admin' ||
      (post && post.user._id === currentUser._id)
    );
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:3000/posts/${post._id}`, {
          withCredentials: true
        });
        toast.success('Post deleted successfully');
        navigate('/posts');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error deleting post');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        formData.append(key, editForm[key]);
      });

      await axios.put(
        `http://localhost:3000/posts/${post._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setIsEditing(false);
      toast.success('Post updated successfully');
      refetch(); // Refresh the post data
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating post');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;

  return (
    <div className="flex flex-col gap-8">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="max-w-4xl mx-auto p-6 space-y-4">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={editForm.desc}
            onChange={(e) => setEditForm({...editForm, desc: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={editForm.content}
            onChange={(e) => setEditForm({...editForm, content: e.target.value})}
            className="w-full p-2 border rounded h-64"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex gap-8">
            <div className="lg:w-3/5 flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
                  {post.title}
                </h1>
                {canModifyPost() && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>Written by</span>
                <Link to={`/user/${post.user?._id}`} className="text-blue-800">
                  {post.user?.username || "Unknown User"}
                </Link>
                <span>On</span>
                <Link className="text-blue-800">{post.category}</Link>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-500 font-medium">{post.desc}</p>
            </div>
            <div className="hidden lg:block w-2/5">
              <img 
                src={`${import.meta.env.VITE_API_URL}/photos/${post.img}`}
                alt={post.title}
                className="rounded-2xl object-cover w-full"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-12 justify-between">
            <div 
              className="lg:text-lg flex flex-col gap-6 text-justify" 
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content) 
              }} 
            />

            <div className="px-4 h-max sticky top-8">
              <h1 className="mb-4 text-sm font-medium"> <b>Post Author</b></h1>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-8">
                  <img
                    src={`https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png`}
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Author"
                  />
                  <Link to={`/user/${post.user?._id}`} className="text-blue-800">
                    <b>{post.user?.username || "Unknown User"}</b>
                  </Link>
                </div>

                {post.user?.bio && (
                  <p className="text-sm text-gray-500">{post.user.bio}</p>
                )}

                <div className="flex gap-2">
                  <Link><Image src="facebook.svg" /></Link>
                  <Link><Image src="instagram.svg" /></Link>
                </div>
              </div>

              <PostMenuActions post={post} />

              <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
              <div className="flex flex-col gap-2 text-sm">
                <Link className="underline">All</Link>
                <Link className="underline">Web Design</Link>
                <Link className="underline">Development</Link>
                <Link className="underline">Databases</Link>
                <Link className="underline">Search Engines</Link>
                <Link className="underline">Marketing</Link>
              </div>

              <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
              <Search />
            </div>
          </div>
          <Comments postId={post._id} />
        </>
      )}
    </div>
  );
};

export default SinglePostPage;