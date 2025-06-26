// === frontend/src/api.js ===
import axiosInstance from '../utils/axiosInstance';

// === frontend/src/pages/AdminPanel.js ===
import React, { useState } from 'react';
import AdminSeasons from '../components/AdminSeasons';
import AdminRegions from '../components/AdminRegions';
import AdminCrops from '../components/AdminCrops';
import AdminCropCalendar from '../components/AdminCropCalendar';

const AdminAgriCal = () => {
  const [visibleComponent, setVisibleComponent] = useState('');

  const renderComponent = () => {
    switch (visibleComponent) {
      case 'regions': return <AdminRegions />;
      case 'crops': return <AdminCrops />;
      case 'seasons': return <AdminSeasons />;
      case 'calendar': return <AdminCropCalendar />;
      default: return null;
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Panneau d'administration - Calendrier Agricole</h1>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button className="btn btn-outline-primary" onClick={() => setVisibleComponent('regions')}>Régions</button>
        <button className="btn btn-outline-success" onClick={() => setVisibleComponent('crops')}>Cultures</button>
        <button className="btn btn-outline-warning" onClick={() => setVisibleComponent('seasons')}>Saisons</button>
        <button className="btn btn-outline-info" onClick={() => setVisibleComponent('calendar')}>Calendrier des cultures</button>
      </div>
      {renderComponent()}
    </div>
  );
};

export default AdminAgriCal;
