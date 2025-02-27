import { useState, useEffect, useContext } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { AuthContext } from "../context/AuthContext"; // ✅ Fixed import

// Fix API URL
const API_URL = "http://localhost:5000/api";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]); // ✅ Ensure it's an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Update axios call
        const response = await axios.get(`${API_URL}/blogs`);
        console.log("API Response:", response.data); // ✅ Debugging
        setBlogs(Array.isArray(response.data) ? response.data : []); // ✅ Ensure it's an array
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await axios.delete(`/api/blogs/${blogId}`);
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete blog post. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Blog Posts</h1>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No blog posts yet!</h3>
          {user && (
            <p className="mt-4">
              <a href="/create" className="text-blue-600 hover:underline">
                Create your first post
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              isOwner={user && blog.author && user._id === blog.author._id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
