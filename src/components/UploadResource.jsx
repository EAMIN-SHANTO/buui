import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadResource = () => {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    type: 'note',
    course: '',
    semester: '',
    resourceUrl: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (file) {
        data.append('img', file);
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/resources`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);

      toast.success('Resource uploaded successfully!');
      setFormData({
        title: '',
        desc: '',
        type: 'note',
        course: '',
        semester: '',
        resourceUrl: '',
      });
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Error uploading resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Course Resource</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="note">Note</option>
            <option value="slide">Slide</option>
            <option value="book">Book</option>
            <option value="video">Video</option>
            <option value="tutorial">Tutorial</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Semester</label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Resource URL (optional)</label>
          <input
            type="url"
            name="resourceUrl"
            value={formData.resourceUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">File (optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Uploading...' : 'Upload Resource'}
        </button>
      </form>
    </div>
  );
};

export default UploadResource; 