import React, { useState, useEffect } from 'react';
import Image from './Image';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('user'));
        setIsLoggedIn(loginStatus);
        setUserRole(userData?.role);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('import.meta.env.VITE_API_URL/usersp/logout');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setUserRole(null);
            navigate("/loginp");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isAdminOrStaff = () => {
        return userRole === 'admin' || userRole === 'staff';
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/department', label: 'Department' },
        { path: '/topics', label: 'Topics' },
        {
            label: 'Utilities',
            children: [
                { path: '/course-review', label: 'Course Review' },
                { path: '/pre-advising', label: 'Pre-Advising Tools' },
                { path: '/software', label: 'Software Resources' }
            ]
        },
        { path: '/about', label: 'About' },
        { path: '/forum', label: 'Forum', highlight: true },
        { path: '/announcements', label: 'Announcements', highlight: true }
    ];

    return (
        <>
            <div className="h-16"></div>
            <nav 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 rounded-2xl mt-2 mr-3 ml-3 ${
                    isScrolled 
                        ? 'bg-white/80 backdrop-blur-md shadow-sm' 
                        : 'bg-white'
                }`}
            >
                <div className="max-w-[2000px] mx-auto px-4">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center gap-3">
                            <img 
                                src="/Buv.svg" 
                                alt="BRACUverse" 
                                className="w-10 h-10 transition-transform hover:scale-110"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                BRACUverse
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {/* Main Navigation Links */}
                            <nav className="flex items-center gap-6">
                                {navLinks.map((item) => (
                                    item.children ? (
                                        <div key={item.label} className="relative group">
                                            {/* Dropdown content */}
                                        </div>
                                    ) : (
                                        <Link
                                            key={item.path || item.label}
                                            to={item.path}
                                            className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                                                location.pathname === item.path
                                                    ? 'text-blue-600'
                                                    : 'text-gray-700 hover:text-blue-600'
                                            } ${
                                                item.highlight
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 px-6'
                                                    : ''
                                            }`}
                                        >
                                            {item.label}
                                            {location.pathname === item.path && !item.highlight && (
                                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                                            )}
                                        </Link>
                                    )
                                ))}
                            </nav>

                            {/* Auth Section */}
                            <div className="flex items-center gap-3">
                                {isLoggedIn ? (
                                    <div className="flex items-center gap-3">
                                        {isAdminOrStaff() && (
                                            <Link to="/admin">
                                                <button className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2">
                                                    <span className="material-icons text-sm">admin_panel_settings</span>
                                                    Admin
                                                </button>
                                            </Link>
                                        )}
                                        <Link to="/profile">
                                            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center hover:shadow-lg transition-all">
                                                <span className="material-icons text-xl">person</span>
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center hover:shadow-lg transition-all"
                                            title="Sign Out"
                                        >
                                            <span className="material-icons text-xl">logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/loginp">
                                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all">
                                            Login
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
                            onClick={() => setOpen(!open)}
                        >
                            <span className="material-icons">
                                {open ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Bottom Sheet */}
                {open && (
                    <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 transition-transform">
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Menu</h3>
                                    <button 
                                        onClick={() => setOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>
                                <nav className="space-y-2">
                                    {navLinks.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center gap-3 p-3 rounded-xl ${
                                                location.pathname === item.path
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="material-icons">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="mt-4 pt-4 border-t">
                                    {isLoggedIn ? (
                                        <div className="space-y-3">
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"
                                            >
                                                <span className="material-icons">account_circle</span>
                                                Profile
                                            </Link>
                                            {isAdminOrStaff() && (
                                                <Link 
                                                    to="/admin" 
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"
                                                >
                                                    <span className="material-icons">admin_panel_settings</span>
                                                    Admin Portal
                                                </Link>
                                            )}
                                            <button 
                                                onClick={() => {
                                                    handleLogout();
                                                    setOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50"
                                            >
                                                <span className="material-icons">logout</span>
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <Link 
                                            to="/loginp" 
                                            onClick={() => setOpen(false)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <span className="material-icons">login</span>
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;