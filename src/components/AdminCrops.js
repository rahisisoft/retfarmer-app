// === frontend/src/components/AdminCrops.js ===
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminCrops = () => {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCrops = () => {
    axiosInstance.get('/crud_crops.php?action=list').then(res => setCrops(res.data));
  };

  useEffect(() => { fetchCrops(); }, []);

  const addCrop = () => {
    if (!form.name.trim()) return;
    axiosInstance.post('/crud_crops.php?action=add', form).then(() => {
      fetchCrops();
      setForm({ name: '', description: '' });
    });
  };

  const deleteCrop = (id) => {
    axiosInstance.get(`/crud_crops.php?action=delete&id=${id}`).then(fetchCrops);
  };

  return (
    <div className="card p-3 mb-4">
      <h2>Cultures</h2>
      <div className="mb-3">
        <input className="form-control mb-2" placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="form-control mb-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button className="btn btn-primary" onClick={addCrop}>Ajouter</button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {crops.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => deleteCrop(c.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCrops;
