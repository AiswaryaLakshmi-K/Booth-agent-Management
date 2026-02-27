import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function IssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await API.get('/issues/');
      setIssues(res.data);
    } catch (error) {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    const resolution = prompt('Enter resolution notes:');
    if (!resolution) return;
    try {
      await API.patch(`/issues/${id}/resolve?resolution=${encodeURIComponent(resolution)}`);
      toast.success('Issue resolved');
      fetchIssues();
    } catch (error) {
      toast.error('Failed to resolve');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Issues</h1>
        <Link to="/issues/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Report Issue
        </Link>
      </div>
      <div className="grid gap-4">
        {issues.map(issue => (
          <div key={issue.id} className="bg-white p-4 rounded shadow">
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
                  <button onClick={() => handleResolve(issue.id)} className="text-green-600 hover:underline">Resolve</button>
                )}
                <Link to={`/issues/${issue.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
              </div>
            </div>
          </div>
        ))}
        {issues.length === 0 && <p className="text-gray-500">No issues reported.</p>}
      </div>
    </div>
  );
}