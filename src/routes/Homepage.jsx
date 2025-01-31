import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { useState, useEffect } from "react";
import axios from "axios";
import AdvertisementSection from '../components/AdvertisementSection';

const Homepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [siteStats, setSiteStats] = useState({
    users: 0,
    visits: 0,
    posts: 0,
    resources: 0
  });

  // Navigation items for left sidebar
  const navigationItems = [
    { icon: "home", label: "Home", path: "/" },
    { icon: "trending_up", label: "Popular", path: "/CurrentTrends" },
    { icon: "star", label: "Course Review", path: "/course-review" },
    { icon: "school", label: "Resources", path: "/resources" },
    { icon: "groups", label: "Clubs", path: "/Clublist" },
    { icon: "event", label: "Events", path: "/events" },
    { icon: "add_circle", label: "Add Course", path: "/CourseForm" },
  ];

  // Community sections
  const communities = [
    { icon: "link", label: "Advising tools", path: "/pre-advising" },
    { icon: "link", label: "Softwares", path: "/software" },
    { icon: "book", label: "Thesis", path: "/thesis" },
    { icon: "engineering", label: "Engineering", path: "/engineering" },
  ];

  useEffect(() => {
    let isMounted = true;
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(loginStatus);
    setUserData(user);

    const fetchSiteStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/usersp/site-stats`);
        if (isMounted) {
          setSiteStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching site statistics:', error);
        if (isMounted) {
          setSiteStats({
            users: 0,
            visits: 0,
            posts: 0,
            resources: 0
          });
        }
      }
    };

    fetchSiteStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <div className="max-w-[1800px] mx-auto pl-0 pr-4 py-4 flex gap-3">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-2 ml-0">
          {/* Quick Post Creation + Mini Profile */}
          {isLoggedIn ? (
            <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={userData?.img || `https://ui-avatars.com/api/?name=${userData?.username}`}
                    alt={userData?.username}
                    className="w-9 h-9 rounded-full flex-shrink-0"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <Link 
                  to="/write"
                  className="flex-1 px-4 py-2.5 bg-[#f8f9f9] hover:bg-[#f1f2f3] rounded text-gray-500 text-sm transition-colors duration-200"
                >
                  What's on your mind, {userData?.username?.split(' ')[0]}?
                </Link>
              </div>
              <div className="flex items-center pt-3 border-t border-gray-100">
                <Link 
                  to="/write"
                  className="flex-1 flex items-center justify-center gap-1 py-2 hover:bg-[#f8f9f9] rounded text-gray-600 text-xs font-medium transition-colors duration-200"
                >
                  <span className="material-icons text-blue-500 text-base">post_add</span>
                  Post
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <Link 
                  to="/resources/upload"
                  className="flex-1 flex items-center justify-center gap-1 py-2 hover:bg-[#f8f9f9] rounded text-gray-600 text-xs font-medium transition-colors duration-200"
                >
                  <span className="material-icons text-green-500 text-base">upload_file</span>
                  Resource
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <Link 
                  to="/course-review"
                  className="flex-1 flex items-center justify-center gap-1 py-2 hover:bg-[#f8f9f9] rounded text-gray-600 text-xs font-medium transition-colors duration-200"
                >
                  <span className="material-icons text-orange-500 text-base">rate_review</span>
                  Review
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-gray-400">person_outline</span>
                </div>
                <Link 
                  to="/loginp"
                  className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded text-gray-500 text-sm transition-colors duration-200"
                >
                  Sign in to share your thoughts...
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded hover:bg-[#f8f9f9] group transition-colors duration-200"
                >
                  <span className="material-icons text-gray-400 group-hover:text-blue-600">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Communities */}
            <div className="mt-6">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Communities
              </h3>
              <div className="space-y-1">
                {communities.map((community) => (
                  <Link
                    key={community.path}
                    to={community.path}
                    className="flex items-center gap-3 px-4 py-2.5 rounded hover:bg-[#f8f9f9] group transition-colors duration-200"
                  >
                    <span className="material-icons text-gray-400 group-hover:text-blue-600">{community.icon}</span>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{community.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Site Stats */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Platform Stats
              </h3>
              <div className="grid grid-cols-2 gap-2 px-2">
                <div className="flex items-center gap-3 p-3 rounded bg-[#f8f9f9] hover:bg-[#f1f2f3] transition-colors">
                  <span className="material-icons text-[#0074CC]">group</span>
                  <div>
                    <p className="text-lg font-bold text-[#0074CC]">{siteStats.users}</p>
                    <p className="text-xs text-gray-600">Users</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-[#f8f9f9] hover:bg-[#f1f2f3] transition-colors">
                  <span className="material-icons text-[#0074CC]">article</span>
                  <div>
                    <p className="text-lg font-bold text-[#0074CC]">{siteStats.posts}</p>
                    <p className="text-xs text-gray-600">Posts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-[#f8f9f9] hover:bg-[#f1f2f3] transition-colors">
                  <span className="material-icons text-[#0074CC]">library_books</span>
                  <div>
                    <p className="text-lg font-bold text-[#0074CC]">{siteStats.resources}</p>
                    <p className="text-xs text-gray-600">Resources</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-[#f8f9f9] hover:bg-[#f1f2f3] transition-colors">
                  <span className="material-icons text-[#0074CC]">visibility</span>
                  <div>
                    <p className="text-lg font-bold text-[#0074CC]">{siteStats.visits}</p>
                    <p className="text-xs text-gray-600">Visits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advertisement Section */}
          <AdvertisementSection />

          {/* After Advertisement Section */}
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-900">BRACU Important Links</h3>
            <div className="space-y-2">
              {/* Academic Links */}
              <div className="space-y-1">
                <a 
                  href="https://www.bracu.ac.bd/academics/departments/computer-science-and-engineering" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">school</span>
                  CSE Department
                </a>
                <a 
                  href="https://cse.sds.bracu.ac.bd/course" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">menu_book</span>
                  Course List
                </a>
                <a 
                  href="https://www.bracu.ac.bd/academics/academic-dates" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">calendar_today</span>
                  Academic Calendar
                </a>
              </div>

              {/* Student Services */}
              <div className="space-y-1">
                <a 
                  href="https://www.bracu.ac.bd/library" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">local_library</span>
                  Ayesha Abed Library
                </a>
                <a 
                  href="https://www.bracu.ac.bd/student-life/office-career-services-alumni-relations-ocsar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">work</span>
                  Career Services
                </a>
                <a 
                  href="https://www.bracu.ac.bd/transport" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">directions_bus</span>
                  Transport Service
                </a>
              </div>

              {/* Research & Resources */}
              <div className="space-y-1">
                <a 
                  href="https://cse.sds.bracu.ac.bd/thesis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">psychology</span>
                  Thesis Resources
                </a>
                <a 
                  href="https://www.bracu.ac.bd/research/teaching-and-research" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <span className="material-icons text-gray-500 text-sm">science</span>
                  Research Portal
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Categories */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <MainCategories />
          </div>

          {/* Featured Posts */}
          <div className="mb-6">
      <FeaturedPosts />
          </div>

          {/* Post List */}
          <div className="bg-white rounded-lg shadow-sm">
            <PostList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;