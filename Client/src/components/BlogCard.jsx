import { Link } from 'react-router-dom';
// import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types'; // Import PropTypes

const BlogCard = ({ blog, isOwner, handleDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {blog.coverImage && (
        <img 
          src={blog.coverImage} 
          alt={blog.title} 
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-5">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{blog.title}</h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content.substring(0, 150)}
          {blog.content.length > 150 ? '...' : ''}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>By {blog.author?.username || 'Unknown'}</span>
          <span className="mx-2">•</span>
          {/* <span>
            {blog.createdAt 
              ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) 
              : 'Recently'}
          </span> */}
        </div>
        
        <div className="flex items-center justify-between">
          <Link 
            to={`/blog/${blog._id}`} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More
          </Link>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Link 
                to={`/edit/${blog._id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation
BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    createdAt: PropTypes.string,
    author: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string
    })
  }).isRequired,
  isOwner: PropTypes.bool,
  handleDelete: PropTypes.func.isRequired
};

// Add default props
BlogCard.defaultProps = {
  isOwner: false,
  handleDelete: () => {}
};

export default BlogCard;