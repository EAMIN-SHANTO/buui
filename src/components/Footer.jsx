import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const Footer = () => {
    return (
        <footer className="bg-white rounded-2xl shadow-sm mt-8 mx-0.5 mb-0.5">
            <div className="max-w-[2000px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                        <img 
                                src="/Buv.svg" 
                                alt="BRACUverse" 
                                className="w-10 h-10 transition-transform hover:scale-110"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                BRACUverse
                            </span>
                        </Link>
                        <p className="text-gray-600 text-sm">
                            Your one-stop educational and utility platform designed for BRAC University students.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                                <span className="material-icons">facebook</span>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                                <span className="material-icons">flutter_dash</span>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700">
                                <span className="material-icons">link</span>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                                <span className="material-icons">code</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">About Us</Link>
                            </li>
                            <li>
                                <Link to="/resources" className="text-gray-600 hover:text-blue-600 text-sm">Course Resources</Link>
                            </li>
                            <li>
                                <Link to="/Clublist" className="text-gray-600 hover:text-blue-600 text-sm">BRACU Clubs</Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-600 hover:text-blue-600 text-sm">Events</Link>
                            </li>
                            <li>
                                <Link to="/forum" className="text-gray-600 hover:text-blue-600 text-sm">Forum</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/CurrentTrends" className="text-gray-600 hover:text-blue-600 text-sm">News & Trends</Link>
                            </li>
                            <li>
                                <Link to="/thesis" className="text-gray-600 hover:text-blue-600 text-sm">Research Projects</Link>
                            </li>
                            <li>
                                <Link to="/utils" className="text-gray-600 hover:text-blue-600 text-sm">Utility Tools</Link>
                            </li>
                            <li>
                                <Link to="/department" className="text-gray-600 hover:text-blue-600 text-sm">Departments</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-gray-600 text-sm">
                                <span className="material-icons text-sm">location_on</span>
                                66 Mohakhali, Dhaka 1212
                            </li>
                            <li className="flex items-center gap-2 text-gray-600 text-sm">
                                <span className="material-icons text-sm">email</span>
                                info@bracuverse.com
                            </li>
                            <li className="flex items-center gap-2 text-gray-600 text-sm">
                                <span className="material-icons text-sm">phone</span>
                                +880 2-222264051-4
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} BRACUverse. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
                                Terms of Service
                            </Link>
                            <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 