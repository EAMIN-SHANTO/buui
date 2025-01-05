import { Link } from "react-router-dom";
import Image from "./Image";


const PostListItem = ({ post }) => {
    return (
        <div className="flex flex-col xl:flex-row gap-8 mb-12">
            <div className="md:hidden xl:block xl:w-1/3">
                <img 
                    src={`${import.meta.env.VITE_API_URL}/photos/${post.img}`} 
                    alt={post.title} 
                    className="rounded-2xl object-cover w=735" 
                />
            </div>

            <div className="flex flex-col gap-4 xl:w-2/3">
                <Link to={`/post/${post.slug}`} className="text-4xl font-semibold">
                    {post.title}
                </Link>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span>Written by</span>
                    <Link 
                        to={`/user/${post.user?._id}`} 
                        className="text-blue-800"
                    >
                        {post.user?.username || "Unknown User"}
                    </Link>
                    <span>On</span>
                    <Link className="text-blue-800">{post.category}</Link>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{post.desc}</p>
                <Link to={`/post/${post.slug}`} className="underline text-red-800">
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default PostListItem;