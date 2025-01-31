import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResourcesManager = () => {
  const [resources, setResources] = React.useState([]);

  React.useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('import.meta.env.VITE_API_URL/api/resources', {
        withCredentials: true
      });
      console.log('Resources:', response.data); // For debugging
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Error fetching resources');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`import.meta.env.VITE_API_URL/api/resources/${resourceId}`, {
          withCredentials: true
        });
        toast.success('Resource deleted successfully');
        fetchResources();
      } catch (error) {
        toast.error('Error deleting resource');
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Course</th>
            <th className="px-4 py-2">Uploaded By</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr key={resource._id}>
              <td className="border px-4 py-2">{resource.title}</td>
              <td className="border px-4 py-2">{resource.type}</td>
              <td className="border px-4 py-2">{resource.course}</td>
              <td className="border px-4 py-2">
                {resource.user ? resource.user.username : 'Unknown'}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <a
                  href={`import.meta.env.VITE_API_URL/uploads/resources/${resource.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-2 py-1 rounded inline-block"
                >
                  View
                </a>
                <button
                  onClick={() => handleDeleteResource(resource._id)}
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

export default ResourcesManager; 