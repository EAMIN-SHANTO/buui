import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState({
    type: '',
    course: '',
    semester: ''
  });

  useEffect(() => {
    const init = async () => {
      await fetchCurrentUser();
      await fetchResources();
    };
    init();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/usersp/profile`, {
        withCredentials: true
      });
      console.log('Fetched user:', response.data);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Error fetching user profile');
    }
  };

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/resources`);
      setResources(response.data);
    } catch (error) {
      toast.error('Error fetching resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/resources/${id}`, {
          withCredentials: true
        });
        toast.success('Resource deleted successfully');
        setResources(resources.filter(resource => resource._id !== id));
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error deleting resource');
      }
    }
  };

  const handleUpdate = async (resource) => {
    const newTitle = prompt('Enter new title:', resource.title);
    const newDesc = prompt('Enter new description:', resource.desc);
    const newCourse = prompt('Enter new course:', resource.course);
    const newSemester = prompt('Enter new semester:', resource.semester);

    if (newTitle && newDesc && newCourse && newSemester) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/resources/${resource._id}`,
          {
            title: newTitle,
            desc: newDesc,
            course: newCourse,
            semester: newSemester
          },
          {
            withCredentials: true
          }
        );
        
        setResources(resources.map(r => 
          r._id === resource._id ? response.data : r
        ));
        
        toast.success('Resource updated successfully');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error updating resource');
      }
    }
  };

  const canModifyResource = (resource) => {
    if (!currentUser) return false;
    
    console.log('Checking permissions:', {
      currentUser,
      resourceUser: resource.user,
      isAdmin: currentUser.role === 'admin',
      isStaff: currentUser.role === 'staff',
      isOwner: resource.user._id === currentUser._id
    });

    return (
      currentUser.role === 'admin' ||
      currentUser.role === 'staff' ||
      resource.user._id === currentUser._id
    );
  };

  const handleDownload = async (id) => {
    try {
      await axios.put(`import.meta.env.VITE_API_URL/api/resources/${id}/download`);
      const updatedResources = resources.map(resource =>
        resource._id === id
          ? { ...resource, downloads: resource.downloads + 1 }
          : resource
      );
      setResources(updatedResources);
    } catch (error) {
      toast.error('Error updating download count');
    }
  };

  const filteredResources = resources.filter(resource => {
    return (
      (!filter.type || resource.type === filter.type) &&
      (!filter.course || resource.course.toLowerCase().includes(filter.course.toLowerCase())) &&
      (!filter.semester || resource.semester.toLowerCase().includes(filter.semester.toLowerCase()))
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Course Resources</h2>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filter.type}
          onChange={(e) => setFilter({...filter, type: e.target.value})}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="note">Notes</option>
          <option value="slide">Slides</option>
          <option value="book">Books</option>
          <option value="video">Videos</option>
          <option value="tutorial">Tutorials</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Filter by course..."
          value={filter.course}
          onChange={(e) => setFilter({...filter, course: e.target.value})}
          className="p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Filter by semester..."
          value={filter.semester}
          onChange={(e) => setFilter({...filter, semester: e.target.value})}
          className="p-2 border rounded"
        />
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource._id} className="border rounded-lg p-4 shadow-sm">
            {resource.img && (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/resources/${resource.img}`}
                alt={resource.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 mb-2">{resource.desc}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Type: {resource.type}</span>
              <span>Course: {resource.course}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Downloads: {resource.downloads}
              </span>
              <div className="flex gap-2">
                {canModifyResource(resource) && (
                  <>
                    <button
                      onClick={() => handleUpdate(resource)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
                {resource.resourceUrl && (
                  <a
                    href={resource.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleDownload(resource._id)}
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewResources; 