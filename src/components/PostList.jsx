import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PostList = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
      return response.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-12 mb-8"> 
      {posts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
}

export default PostList;