import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded ${
      location.pathname === path ? 'bg-sky-100 text-sky-700' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="w-full px-6 pt-6">
      <div className="bg-white rounded-t-xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <Link to="/courses" className="text-xl font-semibold italic">
            Course Registration System
          </Link>

          {user && (
            <div className="text-sm text-gray-500 md:hidden">
              {user.name || user.email}
            </div>
          )}
        </div>

        {user && (
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/courses" className={linkClass('/courses')}>
              Courses
            </Link>

            {user.role !== 'admin' && (
              <Link to="/my-courses" className={linkClass('/my-courses')}>
                My Courses
              </Link>
            )}

            <Link to="/profile" className={linkClass('/profile')}>
              Profile
            </Link>

            <span className="hidden md:inline text-sm text-gray-500 ml-2">
              {user.name || user.email}
            </span>

            <button
              onClick={handleLogout}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;