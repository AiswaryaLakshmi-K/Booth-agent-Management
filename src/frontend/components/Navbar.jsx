import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          <Link to="/" className="text-base md:text-xl font-bold">Booth Agent</Link>
          <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-base">
            {isAdmin && (
              <>
                <Link to="/analytics" className="hover:underline">📊</Link>
                <Link to="/booths" className="hover:underline">Booths</Link>
                <Link to="/agents" className="hover:underline hidden sm:inline">Agents</Link>
              </>
            )}
            <Link to="/families" className="hover:underline">Families</Link>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-2 py-1 md:px-3 rounded hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}