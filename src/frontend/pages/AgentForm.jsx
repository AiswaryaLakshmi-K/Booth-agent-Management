import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function AgentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    password: '',
    role: 'agent',
    assigned_booth_id: '',
    is_active: true
  });

  useEffect(() => {
    loadBooths();
    if (id) {
      API.get(`/users/${id}`)
        .then(res => setFormData({ ...res.data, password: '' }))
        .catch(() => toast.error('Failed to load agent'));
    }
  }, [id]);

  const loadBooths = () => {
    API.get('/booths/')
      .then(res => setBooths(res.data))
      .catch(() => {});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        assigned_booth_id: formData.assigned_booth_id ? parseInt(formData.assigned_booth_id) : null,
        phone: formData.phone || null
      };

      if (id) {
        delete payload.password;
        delete payload.username;
        delete payload.email;
        delete payload.role;
        await API.put(`/users/${id}`, payload);
        toast.success('Agent updated');
      } else {
        if (!payload.password) {
          toast.error('Password is required');
          return;
        }
        await API.post('/users/', payload);
        toast.success('Agent created');
      }
      navigate('/agents');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Save failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Agent' : 'New Agent'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block mb-1">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={!!id}
            className="w-full border rounded p-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={!!id}
            className="w-full border rounded p-2 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1">Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            placeholder="10 digit number"
            className="w-full border rounded p-2"
          />
        </div>

        {!id && (
          <div>
            <label className="block mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!id}
              minLength={6}
              className="w-full border rounded p-2"
            />
          </div>
        )}

        <div>
          <label className="block mb-1">Assign Booth</label>
          <select
            name="assigned_booth_id"
            value={formData.assigned_booth_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Not Assigned</option>
            {booths.map(booth => (
              <option key={booth.id} value={booth.id}>
                {booth.booth_number} - {booth.booth_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Active</label>
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate('/agents')} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
