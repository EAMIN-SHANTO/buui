import React, { useState } from 'react';
import axios from 'axios';
import.meta.env
const CourseForm = () => {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    credits: '',
    department: '',
    prerequisite: '',
    courseDetails: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        prerequisite: formData.prerequisite 
          ? formData.prerequisite.split(',').map(p => p.trim()).filter(Boolean)
          : [],
        credits: Number(formData.credits)
      };

      const response = await axios.post('VITE_API_URL/api/courses', formattedData);
      setMessage(response.data.message);
      setFormData({
        courseCode: '',
        courseName: '',
        credits: '',
        department: '',
        prerequisite: '',
        courseDetails: ''
      });
      setError('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding course';
      setError(errorMessage);
      setMessage('');
      console.error('Error details:', error.response?.data);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Course</h1>
      
      {message && (
        <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
          <span className="material-icons">check_circle</span>
          <p>{message}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <span className="material-icons">error</span>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Code
          </label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
            placeholder="e.g., CSE470"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name
          </label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            placeholder="e.g., Software Engineering"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credits
          </label>
          <input
            type="number"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            required
            min="0"
            max="20"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            placeholder="e.g., CSE"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prerequisites (comma separated)
          </label>
          <input
            type="text"
            name="prerequisite"
            value={formData.prerequisite}
            onChange={handleChange}
            placeholder="e.g., CSE110, CSE111"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Details
          </label>
          <textarea
            name="courseDetails"
            value={formData.courseDetails}
            onChange={handleChange}
            rows="4"
            placeholder="Enter course description and other details..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
