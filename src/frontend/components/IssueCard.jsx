import { Link } from 'react-router-dom';

export default function IssueCard({ issue, onResolve }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{issue.title}</h3>
          <p className="text-sm text-gray-600">{issue.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Category: {issue.category} | Priority: {issue.priority} | Status: {issue.status}
          </p>
          <p className="text-xs text-gray-500">Family ID: {issue.family_id}</p>
        </div>
        <div className="space-x-2">
          {issue.status !== 'resolved' && (
            <button onClick={() => onResolve(issue.id)} className="text-green-600 hover:underline">Resolve</button>
          )}
          <Link to={`/issues/${issue.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
        </div>
      </div>
    </div>
  );
}