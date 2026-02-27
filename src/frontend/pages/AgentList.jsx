import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function AgentList() {
  const [agents, setAgents] = useState([]);
  const [booths, setBooths] = useState([]);

  useEffect(() => {
    loadAgents();
    loadBooths();
  }, []);

  const loadAgents = () => {
    API.get('/users/')
      .then(res => setAgents(res.data.filter(u => u.role === 'agent')))
      .catch(() => toast.error('Failed to load agents'));
  };

  const loadBooths = () => {
    API.get('/booths/')
      .then(res => setBooths(res.data))
      .catch(() => {});
  };

  const getBoothName = (boothId) => {
    const booth = booths.find(b => b.id === boothId);
    return booth ? `${booth.booth_number} - ${booth.booth_name}` : 'Not Assigned';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booth Agents</h1>
        <Link to="/agents/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Agent
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Assigned Booth</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id} className="border-t">
                <td className="px-4 py-3">{agent.username}</td>
                <td className="px-4 py-3">{agent.full_name}</td>
                <td className="px-4 py-3">{agent.phone || '-'}</td>
                <td className="px-4 py-3">{getBoothName(agent.assigned_booth_id)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-sm ${agent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {agent.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/agents/${agent.id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
