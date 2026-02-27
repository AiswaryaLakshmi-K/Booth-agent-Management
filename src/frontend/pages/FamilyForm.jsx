import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function FamilyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booths, setBooths] = useState([]);
  const [formData, setFormData] = useState({
    booth_id: '',
    head_name: '',
    head_phone: '',
    house_number: '',
    street: '',
    notes: ''
  });
  const [members, setMembers] = useState([{
    name: '',
    age: '',
    gender: 'Male',
    relation: 'Self',
    party_preference: '',
    remarks: ''
  }]);

  useEffect(() => {
    loadBooths();
    if (id) {
      API.get(`/families/${id}`)
        .then(res => {
          setFormData(res.data);
          if (res.data.family_members_details) {
            setMembers(res.data.family_members_details);
          }
        })
        .catch(() => toast.error('Failed to load family'));
    } else if (user?.role === 'agent' && user?.assigned_booth_id) {
      setFormData(prev => ({ ...prev, booth_id: user.assigned_booth_id.toString() }));
    }
    
    console.log('User data:', user);
  }, [id, user]);

  const loadBooths = () => {
    API.get('/booths/')
      .then(res => setBooths(res.data))
      .catch(() => {});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([...members, {
      name: '',
      age: '',
      gender: 'Male',
      relation: 'Family Member',
      party_preference: '',
      remarks: ''
    }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.booth_id) {
      toast.error('Please select a booth');
      return;
    }
    
    try {
      const payload = {
        booth_id: parseInt(formData.booth_id),
        head_name: formData.head_name,
        head_phone: formData.head_phone || null,
        house_number: formData.house_number || null,
        street: formData.street || null,
        notes: formData.notes || null,
        total_family_members: members.length,
        eligible_voters: members.filter(m => parseInt(m.age) >= 18).length,
        family_members_details: members.map(m => ({
          name: m.name,
          age: parseInt(m.age),
          gender: m.gender,
          relation: m.relation,
          party_preference: m.party_preference || null,
          remarks: m.remarks || null,
          voter_id: null,
          is_voter: parseInt(m.age) >= 18,
          occupation: null,
          phone: null
        }))
      };

      if (id) {
        await API.put(`/families/${id}`, payload);
        toast.success('Family updated');
      } else {
        await API.post('/families/', payload);
        toast.success('Family added');
      }
      navigate('/families');
    } catch (error) {
      const errorData = error.response?.data;
      console.error('Full Error:', errorData);
      
      if (errorData?.detail) {
        if (Array.isArray(errorData.detail)) {
          const firstError = errorData.detail[0];
          const errorMsg = `${firstError.loc?.join(' -> ') || 'Field'}: ${firstError.msg || 'Invalid'}`;
          toast.error(errorMsg);
        } else {
          toast.error(errorData.detail);
        }
      } else {
        toast.error('Save failed');
      }
    }
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-4xl">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{id ? 'Edit Family' : 'Add Family'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-3 md:p-6 rounded shadow space-y-4 md:space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block mb-1 text-sm md:text-base">Booth *</label>
            <select
              name="booth_id"
              value={formData.booth_id}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 text-sm md:text-base"
            >
              <option value="">Select Booth</option>
              {booths.map(booth => (
                <option key={booth.id} value={booth.id}>
                  {booth.booth_number} - {booth.booth_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm md:text-base">Family Head Name *</label>
            <input
              type="text"
              name="head_name"
              value={formData.head_name}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm md:text-base">Phone</label>
            <input
              type="text"
              name="head_phone"
              value={formData.head_phone}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm md:text-base">House Number</label>
            <input
              type="text"
              name="house_number"
              value={formData.house_number}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm md:text-base"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm md:text-base">Street/Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm md:text-base"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg md:text-xl font-bold">Family Members</h2>
            <button type="button" onClick={addMember} className="bg-green-600 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm hover:bg-green-700">
              + Add
            </button>
          </div>

          {members.map((member, index) => (
            <div key={index} className="border rounded p-3 md:p-4 mb-3 md:mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2 md:mb-3">
                <h3 className="font-semibold text-sm md:text-base">Member {index + 1}</h3>
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMember(index)} className="text-red-600 text-xs md:text-sm hover:underline">
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                <div>
                  <label className="block mb-1 text-xs md:text-sm">Name *</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    required
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs md:text-sm">Age *</label>
                  <input
                    type="number"
                    value={member.age}
                    onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                    required
                    min="1"
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs md:text-sm">Gender *</label>
                  <select
                    value={member.gender}
                    onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs md:text-sm">Relation *</label>
                  <input
                    type="text"
                    value={member.relation}
                    onChange={(e) => handleMemberChange(index, 'relation', e.target.value)}
                    required
                    placeholder="Self, Spouse, Son"
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs md:text-sm">Party Preference</label>
                  <select
                    value={member.party_preference}
                    onChange={(e) => handleMemberChange(index, 'party_preference', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="">Select Party</option>
                    <option value="Party A">Party A</option>
                    <option value="Party B">Party B</option>
                    <option value="Party C">Party C</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs md:text-sm">Remarks</label>
                  <input
                    type="text"
                    value={member.remarks}
                    onChange={(e) => handleMemberChange(index, 'remarks', e.target.value)}
                    placeholder="Any notes"
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-1 text-sm md:text-base">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded p-2 text-sm md:text-base"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate('/families')} className="px-3 md:px-4 py-2 border rounded text-sm md:text-base">
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded hover:bg-blue-700 text-sm md:text-base">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
