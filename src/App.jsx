import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./routes/Homepage";
import TeamUp from "./routes/TeamUp";
import LoginP from "./routes/loginP";
import RegisterP from "./routes/registerP";
import Profile from "./routes/Profile";
import Write from "./routes/Write";
import SinglePostPage from "./routes/SinglePostPage";
import PostListPage from "./routes/PostListPage";
import ClubForm from "./components/ClubForm";
import Clublist from "./components/clubList";
import CourseForm from "./components/CourseForm";
import CourseList from "./components/CourseList";
import CurrentTrends from './components/Currenttrends';
import UploadCurrentTrends from './components/UploadCurrentTrends';
import UploadResource from './components/UploadResource';
import ViewResources from './components/ViewResources';
import Events from './components/Events';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from "./components/Footer";
import { useState, useEffect } from 'react';
import LoadingLogo from './components/LoadingLogo';
import About from "./routes/About";
import CourseReview from "./components/CourseReview";
import PreAdvisingTools from "./components/PreAdvisingTools";
import SoftwareResources from "./components/SoftwareResources";
import Announcements from "./components/Announcements";
import ThesisResources from "./components/ThesisResources";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => clearTimeout(minLoadTime);
  }, []);

  return (
    <Router>
      <div className="w-full px-4 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-5">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/post/:slug" element={<SinglePostPage />} />
            <Route path="/write" element={<Write />} />
            <Route path="/teamup" element={<TeamUp />} />
            <Route path="/loginp" element={<LoginP />} />
            <Route path="/registerp" element={<RegisterP />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Clubs" element={<ClubForm />} />
            <Route path="/Clublist" element={<Clublist />} />
            <Route path="/CourseForm" element={<CourseForm />} />
            <Route path="/CourseList" element={<CourseList />} />
            <Route path="/CurrentTrends" element={<CurrentTrends />} />
            <Route path="/UploadCurrentTrends" element={<UploadCurrentTrends />} />
            <Route path="/upload-resource" element={<UploadResource />} />
            <Route path="/resources" element={<ViewResources />} />
            <Route path="/events" element={<Events />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin', 'staff']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route path="/course-review" element={<CourseReview />} />
            <Route path="/pre-advising" element={<PreAdvisingTools />} />
            <Route path="/software" element={<SoftwareResources />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/thesis" element={<ThesisResources />} />
          </Routes>
        </main>
        <Footer />
        {isLoading && <LoadingLogo onFinish={() => setIsLoading(false)} />}
      </div>
    </Router>
  );
};

export default App;