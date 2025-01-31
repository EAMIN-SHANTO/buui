import React, { useState, useEffect } from 'react';
import axios from 'axios';
import.meta.env
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchReviews = async (courseId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}/reviews`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleCourseClick = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
      fetchReviews(courseId);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course List</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-gray-400 material-icons">search</span>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 flex items-center gap-2">
          <span className="material-icons">error</span>
          <p>{error}</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No courses found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <div 
              key={course._id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleCourseClick(course._id)}
            >
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {course.courseCode || course.code}
                  </h3>
                  <h4 className="text-base text-gray-600 mt-1">
                    {course.courseName || course.name}
                  </h4>
                </div>

                {/* Prerequisites Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.prerequisite && Array.isArray(course.prerequisite) && 
                    course.prerequisite.map((prereq, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                      >
                        HP: {prereq}
                      </span>
                    ))}
                </div>

                {expandedCourse === course._id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Credits:</span> {course.credits}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Department:</span> {course.department}
                      </p>
                      {course.courseDetails && (
                        <p className="text-sm text-gray-700 mt-2">{course.courseDetails}</p>
                      )}
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-4">Course Reviews</h4>
                      {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No reviews yet. Be the first to review this course!
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review._id} className="border-b pb-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center">
                                    <span className="text-yellow-400">★</span>
                                    <span className="ml-1">{review.rating}/5</span>
                                  </div>
                                  <span className="text-gray-300">|</span>
                                  <span>Difficulty: {review.difficulty}/5</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {review.semester} {review.year}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{review.comment}</p>
                              <div className="text-xs text-gray-500 mt-1">
                                Posted by {review.userId?.username || 'Anonymous'} on{' '}
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
