import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES } from '../utils/constants';

export default function IssueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);
  const [formData, setFormData] = useState({
    family_id: '',
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location_details: ''
  });

  useEffect(() => {
    API.get('/families/')
      .then(res => setFamilies(res.data))
      .catch(() => toast.error('Failed to load families'));

    if (id) {
      API.get(`/issues/${id}`)
        .then(res => setFormData(res.data))
        .catch(() => toast.error('Failed to load issue'));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/issues/${id}`, formData);
        toast.success('Issue updated');
      } else {
        await API.post('/issues/', formData);
        toast.success('Issue reported');
      }
      navigate('/issues');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Save failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Issue' : 'Report New Issue'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block mb-1">Family *</label>
          <select name="family_id" value={formData.family_id} onChange={handleChange} required className="w-full border rounded p-2">
            <option value="">Select Family</option>
            {families.map(f => <option key={f.id} value={f.id}>{f.head_name} (ID: {f.id})</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">Title *</label>
          <input name="title" value={formData.title} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full border rounded p-2"></textarea>
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select</option>
            {ISSUE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border rounded p-2">
            {ISSUE_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">Location Details</label>
          <input name="location_details" value={formData.location_details} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate('/issues')} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
        </div>
      </form>
    </div>
  );
}