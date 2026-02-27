import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function BoothForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    booth_number: '',
    booth_name: '',
    area: '',
    ward_number: '',
    total_voters: 0,
    is_active: true
  });

  useEffect(() => {
    if (id) {
      API.get(`/booths/${id}`)
        .then(res => setFormData(res.data))
        .catch(() => toast.error('Failed to load booth'));
    }
  }, [id]);

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
        total_voters: parseInt(formData.total_voters) || 0,
        ward_number: formData.ward_number || null,
        assembly_constituency: null,
        parliamentary_constituency: null,
        latitude: null,
        longitude: null,
        boundary_details: null
      };
      
      if (id) {
        await API.put(`/booths/${id}`, payload);
        toast.success('Booth updated');
      } else {
        await API.post('/booths/', payload);
        toast.success('Booth created');
      }
      navigate('/booths');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Save failed');
    }
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-2xl">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{id ? 'Edit Booth' : 'New Booth'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-3 md:p-6 rounded shadow space-y-4">
        <div>
          <label className="block mb-1 text-sm md:text-base">Booth Number *</label>
          <input
            type="text"
            name="booth_number"
            value={formData.booth_number}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm md:text-base">Booth Name *</label>
          <input
            type="text"
            name="booth_name"
            value={formData.booth_name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm md:text-base">Area/Region *</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            placeholder="e.g., North, South, East, West"
            className="w-full border rounded p-2 text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm md:text-base">Ward Number</label>
          <input
            type="text"
            name="ward_number"
            value={formData.ward_number}
            onChange={handleChange}
            className="w-full border rounded p-2 text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm md:text-base">Total Voters</label>
          <input
            type="number"
            name="total_voters"
            value={formData.total_voters}
            onChange={handleChange}
            className="w-full border rounded p-2 text-sm md:text-base"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm md:text-base">Active</label>
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate('/booths')} className="px-3 md:px-4 py-2 border rounded text-sm md:text-base">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded hover:bg-blue-700 text-sm md:text-base">Save</button>
        </div>
      </form>
    </div>
  );
}
