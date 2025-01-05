import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { useState, useEffect } from "react";
import axios from "axios";

const Homepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [siteStats, setSiteStats] = useState({
    users: 0,
    visits: 0,
    posts: 0,
    resources: 0
  });

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(loginStatus);
    setUserData(user);

    // Fetch site statistics
    const fetchSiteStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/usersp/site-stats`);
        setSiteStats(response.data);
      } catch (error) {
        console.error('Error fetching site statistics:', error);
        // Set default values if fetch fails
        setSiteStats({
          users: 0,
          visits: 0,
          posts: 0,
          resources: 0
        });
      }
    };

    fetchSiteStats();
  }, []);

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-white rounded-2xl">
      {/* Main Grid Layout */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
              <nav className="space-y-2">
                <Link to="/posts" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">article</span>
                  All Posts
                </Link>
                <Link to="/resources" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">school</span>
                  Course Resources
                </Link>
                <Link to="/clubs" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">groups</span>
                  BRACU Clubs
                </Link>
                <Link to="/utils" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">build</span>
                  Utility Tools
                </Link>
                <Link to="/news" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">trending_up</span>
                  Trends | News
                </Link>
                <Link to="/thesis" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">science</span>
                  Thesis Research
                </Link>
              </nav>
            </div>
            <br />
            <hr />
            <br />
            

            {/* Adding Resources Section below Categories */}
            <div className="bg-gradient-to-br from-yellow-50 to-indigo-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Resources</h2>
              <nav className="space-y-3">
                <Link to="/about" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">school</span>
                  About BRACUverse
                </Link>
                <Link to="/advertise" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">campaign</span>
                  Advertise
                </Link>
                <Link to="/help" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">help_outline</span>
                  Help
                </Link>
                <Link to="/blog" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">article</span>
                  Blog
                </Link>
                <Link to="/careers" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">work</span>
                  Careers
                </Link>
                <Link to="/press" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">newspaper</span>
                  Press
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Search and Create Post Bar */}
            <div className="bg-gray-50 rounded-lg mb-4 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <MainCategories />
                </div>
                <Link 
                  to="/write"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <span className="material-icons mr-2">edit</span>
                  Create Post
                </Link>
              </div>
            </div>

            {/* Featured Posts Section */}
            <div className="bg-gray-50 rounded-lg mb-4 p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Featured Posts</h2>
              <FeaturedPosts />
            </div>

            {/* Recent Posts Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Posts</h2>
              <PostList />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Welcome Card - Modern Design */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
              {isLoggedIn && userData ? (
                // Logged in user view - Modern
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                      {userData.profilePic ? (
                        <img 
                          src={userData.profilePic} 
                          alt={userData.username} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold">
                          {userData.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Welcome back!
                  </h2>
                  <p className="text-base font-medium text-gray-800 mb-1">
                    {userData.username}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {userData.email}
                  </p>
                  <div className="w-full grid grid-cols-2 gap-3 text-center text-sm items-center">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="font-bold text-blue-600">12</p>
                      <p className="text-gray-600">Posts</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="font-bold text-indigo-600">48</p>
                      {/* <p className="text-gray-600">Comments</p> */}
                      <p className="text-gray-600" style={{ fontSize: '0.75rem' }}>Comments</p>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">account_circle</span>
                    View Profile
                  </Link>
                </div>
              ) : (
                // Guest user view - Modern
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="material-icons text-3xl text-white">waving_hand</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Welcome to BRACUverse
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Join our community to access all features and connect with other BRACU students
                  </p>
                  <div className="space-y-3">
                    <Link 
                      to="/registerp" 
                      className="block w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                    >
                      Get Started
                    </Link>
                    <Link 
                      to="/loginp" 
                      className="block w-full py-2.5 px-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium border border-gray-200"
                    >
                      Sign In
                    </Link>
                    <p className="text-xs text-gray-500 mt-4">
                      Already have an account? Sign in to continue your journey
                    </p>
                  </div>
                </div>
              )}
            </div>
           <hr />

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Quick Links</h2>
              <div className="space-y-2">
                <Link to="/events" className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">event</span>
                  Events
                </Link>
                <Link to="/resources" className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">library_books</span>
                  Materials
                </Link>
                <Link to="/clubs" className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md text-sm">
                  <span className="material-icons mr-2 text-xl">people</span>
                  Clubs
                </Link>
              </div>
            </div>
            <hr />

            {/* Policy Links - New Section */}
            <div className="bg-gradient-to-br from-red-50 to-indigo-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Policies</h2>
              <div className="space-y-3">
                <Link to="/content-policy" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100/60 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">description</span>
                  Content Policy
                </Link>
                <Link to="/privacy-policy" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100/60 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">gavel</span>
                  Privacy Policy
                </Link>
                <Link to="/user-agreement" className="flex items-center gap-3 text-gray-700 hover:bg-gray-100/60 p-2 rounded-md transition-colors text-sm">
                  <span className="material-icons text-xl">assignment</span>
                  User Agreement
                </Link>
              </div>
            </div>
            <hr />

            {/* Statistics Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 p-2">
                  <span className="material-icons text-xl text-blue-600">group</span>
                  <div>
                    <p className="text-sm font-semibold">Total Users</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatNumber(siteStats.users)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-2">
                  <span className="material-icons text-xl text-green-600">visibility</span>
                  <div>
                    <p className="text-sm font-semibold">Website Visits</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatNumber(siteStats.visits)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-2">
                  <span className="material-icons text-xl text-purple-600">article</span>
                  <div>
                    <p className="text-sm font-semibold">Total Posts</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formatNumber(siteStats.posts)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-2">
                  <span className="material-icons text-xl text-indigo-600">school</span>
                  <div>
                    <p className="text-sm font-semibold">Resources</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {formatNumber(siteStats.resources)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;