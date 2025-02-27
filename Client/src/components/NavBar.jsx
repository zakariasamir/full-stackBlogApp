import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import { useContext } from "react";


const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          CodeWalkers Blog
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/create" className="text-gray-300 hover:text-white">
                Create Post
              </Link>
              <Link to="/profile" className="text-gray-300 hover:text-white">
                Profile ({user?.username})
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
