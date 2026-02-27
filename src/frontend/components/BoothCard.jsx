import { Link } from 'react-router-dom';

export default function BoothCard({ booth, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{booth.booth_number} - {booth.booth_name}</h3>
        <p className="text-sm text-gray-600">{booth.area}, Ward {booth.ward_number}</p>
        <p className="text-xs text-gray-500">Voters: {booth.total_voters}</p>
      </div>
      <div className="space-x-2">
        <Link to={`/booths/${booth.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
        <button onClick={() => onDelete(booth.id)} className="text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
}