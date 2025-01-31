import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import.meta.env
const CourseReview = () => {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState({
    rating: 5,
    difficulty: 3,
    comment: '',
    semester: 'Spring',
    year: new Date().getFullYear()
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    // Fetch courses
    const fetchCourses = async () => {
      try {
        const response = await axios.get('VITE_API_URL/api/courses/all');
        setCourses(response.data);
      } catch (error) {
        setError('Error fetching courses. Please try again later.');
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    // Fetch reviews for selected course
    if (selectedCourse) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`VITE_API_URL/api/courses/${selectedCourse}/reviews`);
          setReviews(response.data.reviews);
        } catch (error) {
          setError('Error fetching reviews. Please try again later.');
        }
      };
      fetchReviews();
    }
  }, [selectedCourse]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/loginp');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `VITE_API_URL/api/courses/${selectedCourse}/reviews`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh reviews
      const response = await axios.get(`VITE_API_URL/api/courses/${selectedCourse}/reviews`);
      setReviews(response.data.reviews);
      
      // Reset form
      setNewReview({
        rating: 5,
        difficulty: 3,
        comment: '',
        semester: 'Spring',
        year: new Date().getFullYear()
      });
      
      setSuccess('Review submitted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting review. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Course Reviews</h1>
      
      {/* Course Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Review Form */}
      {selectedCourse && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <span className="material-icons">error</span>
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
              <span className="material-icons">check_circle</span>
              <p>{success}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Course Rating</label>
              <input
                type="range"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Poor (1)</span>
                <span>Average (3)</span>
                <span>Excellent (5)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Course Difficulty</label>
              <input
                type="range"
                min="1"
                max="5"
                value={newReview.difficulty}
                onChange={(e) => setNewReview({...newReview, difficulty: parseInt(e.target.value)})}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Easy (1)</span>
                <span>Moderate (3)</span>
                <span>Very Hard (5)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Semester</label>
                <select
                  value={newReview.semester}
                  onChange={(e) => setNewReview({...newReview, semester: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="number"
                  value={newReview.year}
                  onChange={(e) => setNewReview({...newReview, year: parseInt(e.target.value)})}
                  min="2000"
                  max={new Date().getFullYear()}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows="4"
                placeholder="Share your experience with this course..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Course Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this course!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-6 bg-white rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="ml-1 font-medium">{review.rating}/5</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="text-gray-600">
                    Difficulty: {review.difficulty}/5
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {review.semester} {review.year}
                </div>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <div className="text-sm text-gray-500">
                Posted by {review.userId.username} on {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReview; 