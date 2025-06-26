// === frontend/src/components/AdminSeasons.js ===
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminSeasons = () => {
  const [seasons, setSeasons] = useState([]);
  const [form, setForm] = useState({ name: '', start_month: 1, end_month: 12 });

  const fetchSeasons = () => {
    axiosInstance.get('/crud_seasons.php?action=list').then(res => setSeasons(res.data));
  };

  useEffect(() => { fetchSeasons(); }, []);

  const addSeason = () => {
    axiosInstance.post('/crud_seasons.php?action=add', form).then(() => {
      fetchSeasons();
      setForm({ name: '', start_month: 1, end_month: 12 });
    });
  };

  const deleteSeason = (id) => {
    axiosInstance.get(`/crud_seasons.php?action=delete&id=${id}`).then(fetchSeasons);
  };

  return (
    <div className="card p-3 mb-4">
      <h2>Saisons Agricoles</h2>
      <div className="mb-2">
        <input className="form-control mb-2" placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <div className="row">
          <div className="col">
            <input type="number" className="form-control" placeholder="Mois Début" value={form.start_month} onChange={e => setForm({ ...form, start_month: e.target.value })} />
          </div>
          <div className="col">
            <input type="number" className="form-control" placeholder="Mois Fin" value={form.end_month} onChange={e => setForm({ ...form, end_month: e.target.value })} />
          </div>
        </div>
      </div>
      <button className="btn btn-primary mb-3" onClick={addSeason}>Ajouter</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Mois Début</th>
            <th>Mois Fin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {seasons.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.start_month}</td>
              <td>{s.end_month}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => deleteSeason(s.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSeasons;
