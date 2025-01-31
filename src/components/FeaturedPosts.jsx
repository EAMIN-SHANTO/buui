import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import.meta.env
const FeaturedPosts = () => {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('VITE_API_URL/posts', {
                withCredentials: true
            });
            
            // Get random posts from the response
            const allPosts = response.data;
            const randomPosts = getRandomPosts(allPosts, 4); // Get 4 random posts
            setFeaturedPosts(randomPosts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Error loading featured posts');
            setLoading(false);
        }
    };

    const getRandomPosts = (posts, count) => {
        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const mainPost = featuredPosts[0];
    const sidePosts = featuredPosts.slice(1);

    return (
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
            {/* Main Featured Post */}
            {mainPost && (
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    {mainPost.img && (
                        <img 
                            src={`VITE_API_URL/photos/${mainPost.img}`}
                            alt={mainPost.title}
                            className="rounded-3xl object-cover w-full h-[450px]"
                        />
                    )}
                    
                    <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                        <h1 className="font-semibold lg:text-lg">01.</h1>
                        <Link className="text-blue-800 lg:text-lg">{mainPost.category || 'General'}</Link>
                        <span className="text-gray-500">
                            {new Date(mainPost.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <Link to={`/post/${mainPost.slug}`} className="text-xl lg:text-3xl font-semibold lg:font-bold">
                        {mainPost.title}
                    </Link>
                </div>
            )}

            {/* Side Posts */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                {sidePosts.map((post, index) => (
                    <div key={post._id} className="lg:h-1/3 flex justify-between gap-4">
                        <div className="w-1/3 aspect-video">
                            {post.img && (
                                <img 
                                src={`${import.meta.env.VITE_API_URL}/photos/${post.img}`}
                                alt={post.title}
                                    className="rounded-3xl object-cover w-full h-full"
                                />
                            )}
                        </div>
                        <div className="w-2/3">
                            <div className="flex item-center gap-4 text-sm lg:text-base mb-4">
                                <h1 className="font-semibold text-sm lg:text-base">0{index + 2}.</h1>
                                <Link to={`/category/${post.category}`} className="text-blue-800">
                                    {post.category || 'General'}
                                </Link>
                                <span className="text-gray-500 text-sm">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <Link 
                                    to={`/post/${post.slug}`} 
                                    className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
                                >
                                    {post.title}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedPosts;