import axiosInstance from '../utils/axiosInstance';

import React, { useState } from 'react';
import AdminRegions from '../components/AdminRegions';
import AdminCrops from '../components/AdminCrops';
import AdminSeasons from '../components/AdminSeasons';
import AdminCropCalendar from '../components/AdminCropCalendar';
import UserLayout from "@/components/UserLayout";

const AdminCal = () => {
  const [visible, setVisible] = useState('');

  const renderSection = () => {
    switch (visible) {
      case 'regions': return <AdminRegions />;
      case 'crops': return <AdminCrops />;
      case 'seasons': return <AdminSeasons />;
      case 'calendar': return <AdminCropCalendar />;
      default: return <p className="text-muted">Veuillez sélectionner un module à gérer.</p>;
    }
  };

  return (
    <UserLayout>
    <div className="container py-4">
      <h1 className="mb-4">Panneau de Gestion Agricole</h1>
      <div className="mb-4 d-flex flex-wrap gap-2">
        <button className="btn btn-outline-primary" onClick={() => setVisible('regions')}>Régions</button>
        <button className="btn btn-outline-success" onClick={() => setVisible('crops')}>Cultures</button>
        <button className="btn btn-outline-warning" onClick={() => setVisible('seasons')}>Saisons</button>
        <button className="btn btn-outline-info" onClick={() => setVisible('calendar')}>Calendrier des Cultures</button>
      </div>
      {renderSection()}
    </div>
    </UserLayout>
  );
};

export default AdminCal;
