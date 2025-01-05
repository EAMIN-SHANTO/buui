import React from 'react';

const About = () => {
    const features = [
        {
            icon: 'school',
            title: 'Academic Resources',
            description: 'Access to course materials, study guides, and academic resources.'
        },
        {
            icon: 'groups',
            title: 'Community',
            description: 'Connect with fellow students, share experiences, and collaborate.'
        },
        {
            icon: 'forum',
            title: 'Discussion Forums',
            description: 'Engage in academic discussions, ask questions, and share knowledge.'
        },
        {
            icon: 'event',
            title: 'Events',
            description: 'Stay updated with university events, workshops, and activities.'
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-white">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold sm:text-5xl">
                    About <span className="text-blue-600">BRACUverse</span>
                </h1>
                <p className="mt-4 text-xl text-gray-700">
                    Your comprehensive platform for BRACU academic resources, community engagement, and collaboration.
                </p>
            </div>

            {/* Mission Section */}
            <div className="mt-16 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                <p className="mt-4 text-lg text-gray-700">
                    To create a unified digital space where BRACU students can access resources, 
                    connect with peers, and enhance their academic journey through collaboration 
                    and knowledge sharing.
                </p>
            </div>

            {/* Features Grid */}
            <div className="mt-20">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="relative p-6 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <span className="material-icons text-4xl text-blue-600">
                                {feature.icon}
                            </span>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-gray-700">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl py-12 px-6 sm:px-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">1000+</h3>
                        <p className="mt-2 text-blue-100">Active Users</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">500+</h3>
                        <p className="mt-2 text-blue-100">Resources</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">100+</h3>
                        <p className="mt-2 text-blue-100">Daily Posts</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">50+</h3>
                        <p className="mt-2 text-blue-100">Contributors</p>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="mt-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
                <p className="mt-4 text-lg text-gray-700">
                    Have questions or suggestions? We'd love to hear from you.
                </p>
                <a 
                    href="mailto:contact@bracuverse.com" 
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    Contact Us
                    <span className="material-icons ml-2">arrow_forward</span>
                </a>
            </div>
        </div>
    );
};

export default About; 