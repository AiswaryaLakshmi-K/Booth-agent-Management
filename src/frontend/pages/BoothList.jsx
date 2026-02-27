import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BoothList() {
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooths();
  }, []);

  const fetchBooths = async () => {
    try {
      const res = await API.get('/booths/');
      setBooths(res.data);
    } catch (error) {
      toast.error('Failed to load booths');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await API.delete(`/booths/${id}`);
      toast.success('Booth deleted');
      fetchBooths();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booths</h1>
        <Link to="/booths/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Booth
        </Link>
      </div>
      <div className="grid gap-4">
        {booths.map(booth => (
          <div key={booth.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{booth.booth_number} - {booth.booth_name}</h3>
              <p className="text-sm text-gray-600">{booth.area}, Ward {booth.ward_number}</p>
              <p className="text-xs text-gray-500">Voters: {booth.total_voters}</p>
            </div>
            <div className="space-x-2">
              <Link to={`/booths/${booth.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
              <button onClick={() => handleDelete(booth.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {booths.length === 0 && <p className="text-gray-500">No booths found.</p>}
      </div>
    </div>
  );
}