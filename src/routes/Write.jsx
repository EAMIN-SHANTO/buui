import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;
const Write = () => {
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/usersp/profile`, {
          withCredentials: true
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate('/loginp');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/post/${res.data.slug}`);
    },
    onError: (error) => {
      console.error("Post creation error:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      toast.error(error.response?.data?.error || "Failed to create post");
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append("img", image);
    formData.append("title", e.target.title.value);
    formData.append("category", e.target.category.value);
    formData.append("desc", e.target.desc.value);
    formData.append("content", value);

    mutation.mutate(formData);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          name="title"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          name="desc"
          className="p-2 border rounded"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="p-2 border rounded"
          required
        />
        <select
          name="category"
          className="p-2 border rounded"
          required
        >
          <option value="">Choose a category:</option>
          <option value="General">General</option>
          <option value="Web Design">Web Design</option>
          <option value="Development">Development</option>
          <option value="Databases">Databases</option>
          <option value="Search Engines">Search Engines</option>
          <option value="Marketing">Marketing</option>
        </select>
        <ReactQuill
          theme="snow"
          className="flex-1 rounded-xl bg-white shadow-md"
          value={value}
          onChange={setValue}
        />
        <button
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Write;