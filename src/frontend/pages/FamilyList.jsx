import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function FamilyList() {
  const { user } = useAuth();
  const [families, setFamilies] = useState([]);
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooth, setSelectedBooth] = useState('');

  useEffect(() => {
    loadBooths();
    fetchFamilies();
  }, []);

  const loadBooths = () => {
    API.get('/booths/')
      .then(res => setBooths(res.data))
      .catch(() => {});
  };

  const fetchFamilies = async () => {
    try {
      const res = await API.get('/families/');
      setFamilies(res.data);
    } catch (error) {
      toast.error('Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await API.delete(`/families/${id}`);
      toast.success('Family deleted');
      fetchFamilies();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filteredFamilies = selectedBooth
    ? families.filter(f => f.booth_id === parseInt(selectedBooth))
    : families;

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
        <h1 className="text-xl md:text-2xl font-bold">Families</h1>
        <Link to="/families/new" className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded hover:bg-blue-700 text-sm md:text-base w-full sm:w-auto text-center">
          Add Family
        </Link>
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white p-3 md:p-4 rounded shadow mb-4 md:mb-6">
          <label className="block mb-2 text-sm md:text-base">Filter by Booth</label>
          <select
            value={selectedBooth}
            onChange={(e) => setSelectedBooth(e.target.value)}
            className="border rounded p-2 w-full md:w-64 text-sm md:text-base"
          >
            <option value="">All Booths</option>
            {booths.map(booth => (
              <option key={booth.id} value={booth.id}>
                {booth.booth_number} - {booth.booth_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-3 md:gap-4">
        {filteredFamilies.map(family => (
          <div key={family.id} className="bg-white p-3 md:p-4 rounded shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-base md:text-lg">{family.head_name}</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  {family.house_number} {family.street}
                </p>
                <p className="text-xs md:text-sm">
                  Phone: {family.head_phone || 'N/A'} | Members: {family.total_family_members} | Voters: {family.eligible_voters}
                </p>
                
                {family.family_members_details && family.family_members_details.length > 0 && (
                  <div className="mt-2 md:mt-3 border-t pt-2">
                    <p className="text-xs md:text-sm font-semibold mb-2">Family Members:</p>
                    <div className="space-y-1">
                      {family.family_members_details.map((member, idx) => (
                        <div key={idx} className="text-xs md:text-sm bg-gray-50 p-2 rounded">
                          <span className="font-medium">{member.name}</span> ({member.age}, {member.gender}) - {member.relation}
                          {member.party_preference && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              {member.party_preference}
                            </span>
                          )}
                          {member.remarks && (
                            <span className="ml-2 text-gray-600 italic">- {member.remarks}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 w-full md:w-auto justify-end">
                <Link to={`/families/${family.id}/edit`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                <button onClick={() => handleDelete(family.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filteredFamilies.length === 0 && <p className="text-gray-500 text-sm md:text-base">No families found.</p>}
      </div>
    </div>
  );
}