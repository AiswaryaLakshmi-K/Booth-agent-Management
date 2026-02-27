import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4 md:mb-6 text-sm md:text-base">Welcome, <span className="font-semibold">{user?.full_name || user?.username}</span> ({user?.role})</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {isAdmin && (
          <>
            <Link to="/analytics" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 md:p-6 rounded shadow hover:shadow-lg transition">
              <h2 className="text-lg md:text-xl font-bold mb-2">📊 Analytics</h2>
              <p className="text-sm md:text-base">Party support & statistics</p>
            </Link>
            <Link to="/booths" className="bg-white p-4 md:p-6 rounded shadow hover:shadow-lg transition">
              <h2 className="text-lg md:text-xl font-bold mb-2">Booths</h2>
              <p className="text-gray-600 text-sm md:text-base">Manage polling booths</p>
            </Link>
            <Link to="/agents" className="bg-white p-4 md:p-6 rounded shadow hover:shadow-lg transition">
              <h2 className="text-lg md:text-xl font-bold mb-2">Booth Agents</h2>
              <p className="text-gray-600 text-sm md:text-base">Manage booth agents</p>
            </Link>
          </>
        )}
        
        <Link to="/families" className="bg-white p-4 md:p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="text-lg md:text-xl font-bold mb-2">Families</h2>
          <p className="text-gray-600 text-sm md:text-base">{isAdmin ? 'View all families' : 'Add family data'}</p>
        </Link>
        
        <Link to="/issues" className="bg-white p-4 md:p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="text-lg md:text-xl font-bold mb-2">Issues</h2>
          <p className="text-gray-600 text-sm md:text-base">Track local issues</p>
        </Link>
      </div>
    </div>
  );
}
