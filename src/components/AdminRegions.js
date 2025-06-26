// === frontend/src/components/AdminRegions.js ===
import React, { useEffect, useState } from 'react';
import axiosInstance from "../utils/axiosInstance";


const AdminRegions = () => {
  const [regions, setRegions] = useState([]);
  const [name, setName] = useState('');

  const fetchRegions = () => {
    axiosInstance.get('/crud_regions.php?action=list').then(res => setRegions(res.data));
  };

  useEffect(() => { fetchRegions(); }, []);

  const addRegion = () => {
    if (!name.trim()) return;
    axiosInstance.post('/crud_regions.php?action=add', { name }).then(() => {
      fetchRegions();
      setName('');
    });
  };

  const deleteRegion = (id) => {
    axiosInstance.get(`/crud_regions.php?action=delete&id=${id}`).then(fetchRegions);
  };

  return (
    <div className="card p-3 mb-4">
      <h2>Régions</h2>
      <div className="mb-3">
        <input className="form-control" placeholder="Nom de la région" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn btn-primary mt-2" onClick={addRegion}>Ajouter</button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {regions.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => deleteRegion(r.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRegions;