import { Link } from 'react-router-dom';

export default function FamilyCard({ family, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{family.head_name}</h3>
          <p className="text-sm text-gray-600">
            {family.house_number}, {family.street}, {family.landmark}, {family.pincode}
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span> {family.head_phone || 'N/A'} |
            <span className="font-medium"> Support:</span> {family.supporter_type || 'unknown'}
          </p>
          <p className="text-sm text-gray-500">
            Members: {family.total_family_members}, Voters: {family.eligible_voters}
          </p>
        </div>
        <div className="space-x-2">
          <Link to={`/families/${family.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
          <button onClick={() => onDelete(family.id)} className="text-red-600 hover:underline">Delete</button>
        </div>
      </div>
    </div>
  );
}