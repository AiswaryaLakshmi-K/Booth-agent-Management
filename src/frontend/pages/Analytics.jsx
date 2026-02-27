import { useEffect, useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function Analytics() {
  const [booths, setBooths] = useState([]);
  const [families, setFamilies] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState('');
  const [stats, setStats] = useState({
    totalFamilies: 0,
    totalVoters: 0,
    partyA: 0,
    partyB: 0,
    partyC: 0,
    others: 0,
    undecided: 0
  });

  useEffect(() => {
    loadBooths();
    loadFamilies();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [families, selectedBooth]);

  const loadBooths = () => {
    API.get('/booths/')
      .then(res => setBooths(res.data))
      .catch(() => toast.error('Failed to load booths'));
  };

  const loadFamilies = () => {
    API.get('/families/')
      .then(res => setFamilies(res.data))
      .catch(() => toast.error('Failed to load families'));
  };

  const calculateStats = () => {
    let filtered = families;
    if (selectedBooth) {
      filtered = families.filter(f => f.booth_id === parseInt(selectedBooth));
    }

    const totalFamilies = filtered.length;
    const totalVoters = filtered.reduce((sum, f) => sum + (f.eligible_voters || 0), 0);

    let partyA = 0, partyB = 0, partyC = 0, others = 0, undecided = 0;

    filtered.forEach(family => {
      if (family.family_members_details) {
        family.family_members_details.forEach(member => {
          if (member.is_voter) {
            switch (member.party_preference) {
              case 'Party A': partyA++; break;
              case 'Party B': partyB++; break;
              case 'Party C': partyC++; break;
              case 'Others': others++; break;
              default: undecided++;
            }
          }
        });
      }
    });

    setStats({ totalFamilies, totalVoters, partyA, partyB, partyC, others, undecided });
  };

  const getPercentage = (count) => {
    return stats.totalVoters > 0 ? ((count / stats.totalVoters) * 100).toFixed(1) : 0;
  };

  const getTopParty = () => {
    const parties = [
      { name: 'Party A', count: stats.partyA },
      { name: 'Party B', count: stats.partyB },
      { name: 'Party C', count: stats.partyC }
    ];
    return parties.sort((a, b) => b.count - a.count)[0];
  };

  const topParty = getTopParty();

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Election Analytics</h1>

      <div className="bg-white p-3 md:p-4 rounded shadow mb-4 md:mb-6">
        <label className="block mb-2 text-sm md:text-base font-semibold">Filter by Booth</label>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-blue-100 p-3 md:p-4 rounded shadow">
          <p className="text-xs md:text-sm text-gray-600">Total Families</p>
          <p className="text-xl md:text-3xl font-bold text-blue-600">{stats.totalFamilies}</p>
        </div>
        <div className="bg-green-100 p-3 md:p-4 rounded shadow">
          <p className="text-xs md:text-sm text-gray-600">Total Voters</p>
          <p className="text-xl md:text-3xl font-bold text-green-600">{stats.totalVoters}</p>
        </div>
        <div className="bg-purple-100 p-3 md:p-4 rounded shadow col-span-2">
          <p className="text-xs md:text-sm text-gray-600">Leading Party</p>
          <p className="text-xl md:text-3xl font-bold text-purple-600">
            {topParty.name} ({topParty.count})
          </p>
        </div>
      </div>

      <div className="bg-white p-3 md:p-6 rounded shadow">
        <h2 className="text-lg md:text-xl font-bold mb-4">Party-wise Support</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm md:text-base font-semibold">Party A</span>
              <span className="text-sm md:text-base">{stats.partyA} ({getPercentage(stats.partyA)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 md:h-6">
              <div className="bg-red-500 h-4 md:h-6 rounded-full" style={{ width: `${getPercentage(stats.partyA)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm md:text-base font-semibold">Party B</span>
              <span className="text-sm md:text-base">{stats.partyB} ({getPercentage(stats.partyB)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 md:h-6">
              <div className="bg-blue-500 h-4 md:h-6 rounded-full" style={{ width: `${getPercentage(stats.partyB)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm md:text-base font-semibold">Party C</span>
              <span className="text-sm md:text-base">{stats.partyC} ({getPercentage(stats.partyC)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 md:h-6">
              <div className="bg-green-500 h-4 md:h-6 rounded-full" style={{ width: `${getPercentage(stats.partyC)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm md:text-base font-semibold">Others</span>
              <span className="text-sm md:text-base">{stats.others} ({getPercentage(stats.others)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 md:h-6">
              <div className="bg-yellow-500 h-4 md:h-6 rounded-full" style={{ width: `${getPercentage(stats.others)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm md:text-base font-semibold">Undecided</span>
              <span className="text-sm md:text-base">{stats.undecided} ({getPercentage(stats.undecided)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 md:h-6">
              <div className="bg-gray-500 h-4 md:h-6 rounded-full" style={{ width: `${getPercentage(stats.undecided)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
