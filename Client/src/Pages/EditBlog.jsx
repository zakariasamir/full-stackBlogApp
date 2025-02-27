import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

const EditBlog = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add blog state
  const [blog, setBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch blog and check authorization
  useEffect(() => {
    const fetchBlog = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/blogs/${id}`);
        const blogData = response.data;
        setBlog(blogData);

        // Check if user is the author
        if (user?._id !== blogData.author?._id) {
          setError("You do not have permission to edit this blog post");
          navigate("/");
          return;
        }

        setFormData({
          title: blogData.title || "",
          content: blogData.content || "",
          coverImage: blogData.coverImage || "",
        });
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch blog post", err);
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, user?._id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await axios.put(`${API_URL}/blogs/${id}`, formData);

      setIsSubmitting(false);
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog post");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cover Image URL (optional)
          </label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog post content here..."
            required
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/blog/${id}`}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Link>
          <div className="flex space-x-4">
            <Link
              to={`/blog/${id}`}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
