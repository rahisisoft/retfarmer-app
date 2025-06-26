import React, { useState, useEffect, useContext } from 'react';
import UserLayout from '@/components/UserLayout';
import axiosInstance from '@/utils/axiosInstance';
import BASE_API_URL from '../utils/config';
import { LanguageContext } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const Profile = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation('profile');

  const [userData, setUserData] = useState({
    id: '',
    name: '',
    phone: '',
    job: '',
    country: '',
    photo: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      axiosInstance.get(`/get_user.php?id=${storedUser.id}`).then(res => {
        setUserData(res.data);
      });
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("id", userData.id);

    const res = await axiosInstance.post("/upload_photo.php", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data.photo) {
      setUserData(prev => ({ ...prev, photo: res.data.photo }));
    }
  };

  const handleSave = () => {
    axiosInstance.post('/update_user.php', userData).then(res => {
      if (res.data.success) {
        alert(t.profile_updated);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    });
  };

  return (
    <UserLayout>
      <div className="mb-3 text-center">
        <div className="position-relative d-inline-block">
  <img
    src={`${BASE_API_URL}/${userData.photo}`}
    alt="Avatar"
    className="rounded-circle"
    style={{ width: "100px", height: "100px", objectFit: "cover" }}
  />

  <label
    htmlFor="photoUpload"
    className="position-absolute bottom-0 end-0 bg-white rounded-circle border shadow p-1"
    style={{ cursor: "pointer", width: "30px", height: "30px", textAlign: "center", fontSize: "18px" }}
    title="Change photo"
  >
    📷
  </label>

  <input
    id="photoUpload"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handlePhotoChange}
  />
</div>

      </div>

      <div className="form-group mb-3">
        <label>{t.name}</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          className="form-control"
          placeholder={t.name_placeholder}
        />
      </div>

      <div className="form-group mb-3">
        <label>{t.phone}</label>
        <input
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          className="form-control"
          placeholder={t.phone_placeholder}
        />
      </div>

      <div className="form-group mb-3">
        <label>{t.job}</label>
        <input
          type="text"
          name="job"
          value={userData.job}
          onChange={handleChange}
          className="form-control"
          placeholder={t.job_placeholder}
        />
      </div>

      <div className="form-group mb-3">
        <label>{t.country}</label>
        <input
          type="text"
          name="country"
          value={userData.country}
          onChange={handleChange}
          className="form-control"
          placeholder={t.country_placeholder}
        />
      </div>

      <button className="btn btn-success" onClick={handleSave}>
        💾 {t.save}
      </button>
    </UserLayout>
  );
};

export default Profile;
