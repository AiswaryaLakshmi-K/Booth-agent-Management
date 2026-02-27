import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <ul className="space-y-2">
        <li><Link to="/" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link></li>
        <li><Link to="/booths" className="block p-2 hover:bg-gray-700 rounded">Booths</Link></li>
        <li><Link to="/families" className="block p-2 hover:bg-gray-700 rounded">Families</Link></li>
        <li><Link to="/issues" className="block p-2 hover:bg-gray-700 rounded">Issues</Link></li>
      </ul>
    </aside>
  );
}