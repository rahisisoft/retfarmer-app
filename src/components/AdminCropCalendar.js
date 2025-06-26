import React, { useEffect, useState } from 'react';
import axiosInstance from "@/utils/axiosInstance";

const AdminCropCalendar = () => {
  const [regions, setRegions] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [crops, setCrops] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    crop_id: '', region_id: '', season_id: '',
    sowing_start: '', sowing_end: '',
    harvest_start: '', harvest_end: ''
  });

  const fetchAll = () => {
    axiosInstance.get('/crud_regions.php?action=list').then(r => setRegions(r.data));
    axiosInstance.get('/crud_seasons.php?action=list').then(s => setSeasons(s.data));
    axiosInstance.get('/crud_crops.php?action=list').then(c => setCrops(c.data));
    axiosInstance.get('/crud_crop_calendar.php?action=list').then(c => setEntries(c.data));
  };

  useEffect(() => { fetchAll(); }, []);

  const addEntry = () => {
    axiosInstance.post('/crud_crop_calendar.php?action=add', form).then(() => {
      fetchAll();
      setForm({ crop_id: '', region_id: '', season_id: '', sowing_start: '', sowing_end: '', harvest_start: '', harvest_end: '' });
    });
  };

  return (
    <div className="card p-3 mb-4">
      <h2>Calendrier des Cultures</h2>
      <div className="row mb-3">
        <div className="col-md">
          <select className="form-select" value={form.crop_id} onChange={e => setForm({ ...form, crop_id: e.target.value })}>
            <option value=''>Culture</option>
            {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-md">
          <select className="form-select" value={form.region_id} onChange={e => setForm({ ...form, region_id: e.target.value })}>
            <option value=''>Région</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="col-md">
          <select className="form-select" value={form.season_id} onChange={e => setForm({ ...form, season_id: e.target.value })}>
            <option value=''>Saison</option>
            {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <input type='date' className="form-control" value={form.sowing_start} onChange={e => setForm({ ...form, sowing_start: e.target.value })} placeholder='Semis début' />
        </div>
        <div className="col">
          <input type='date' className="form-control" value={form.sowing_end} onChange={e => setForm({ ...form, sowing_end: e.target.value })} placeholder='Semis fin' />
        </div>
        <div className="col">
          <input type='date' className="form-control" value={form.harvest_start} onChange={e => setForm({ ...form, harvest_start: e.target.value })} placeholder='Récolte début' />
        </div>
        <div className="col">
          <input type='date' className="form-control" value={form.harvest_end} onChange={e => setForm({ ...form, harvest_end: e.target.value })} placeholder='Récolte fin' />
        </div>
      </div>
      <button className="btn btn-primary mb-3" onClick={addEntry}>Ajouter</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Culture</th>
            <th>Région</th>
            <th>Saison</th>
            <th>Semis</th>
            <th>Récolte</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i}>
              <td>{e.crop_name}</td>
              <td>{e.region_name}</td>
              <td>{e.season_name}</td>
              <td>{e.sowing_start} → {e.sowing_end}</td>
              <td>{e.harvest_start} → {e.harvest_end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCropCalendar;
