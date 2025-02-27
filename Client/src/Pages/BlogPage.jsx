import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// import { formatDistanceToNow } from "date-fns";

const API_URL = "http://localhost:5000/api";

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to fetch blog post. It may have been removed or does not exist.",
          err
        );
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await axios.delete(`${API_URL}/blogs/${id}`);
        navigate("/");
      } catch (err) {
        setError("Failed to delete the blog. Please try again.", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Blog post not found"}
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = user && blog.author?._id === user._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/"
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        &larr; Back to Home
      </Link>

      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      <div className="flex items-center text-gray-600 mb-8">
        <span>By {blog.author?.username || "Unknown"}</span>
        <span className="mx-2">•</span>
        {/* <span>
          {blog.createdAt
            ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })
            : "Recently"}
        </span> */}
      </div>

      <div className="prose prose-lg max-w-none">
        {blog.content
          .split("\n")
          .map((paragraph, index) =>
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          )}
      </div>

      {isOwner && (
        <div className="mt-8 flex space-x-4">
          <Link
            to={`/edit/${blog._id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Edit Post
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
