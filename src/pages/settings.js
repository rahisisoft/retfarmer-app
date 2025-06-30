import React, { useContext, useState, useEffect } from 'react';
import UserLayout from '@/components/UserLayout';
import { LanguageContext } from '@/contexts/LanguageContext';
import { useRouter } from 'next/router';
import { useTranslation } from '@/hooks/useTranslation';

const Settings = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation('settings');
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Chargement de l'utilisateur une seule fois
    const stored =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse user from storage');
      }
    }
  }, []);

  const flags = {
    en: { name: 'English', icon: '🇬🇧' },
    fr: { name: 'Français', icon: '🇫🇷' },
    rn: { name: 'Kirundi', icon: '🇧🇮' },
    sw: { name: 'Swahili', icon: '🇹🇿' },
  };

  const openTranslations = () => {
    router.push('/translations');
  };

  const openUserManager = () => {
    router.push('/users');
  };

  return (
    <UserLayout>
      <h4>🌐 {t.choose_language}</h4>

      <div className="mb-4">
        <select
          className="form-select"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          {Object.entries(flags).map(([langCode, { icon, name }]) => (
            <option key={langCode} value={langCode}>
              {icon} {name}
            </option>
          ))}
        </select>
      </div>

      {user?.role === 'admin' && (
        <>
          <button
            className="btn btn-outline-primary mb-3 mr-2"
            onClick={openTranslations}
          >
            ⚙️ {t.open_translation_manager}
          </button>

          <button className="btn btn-outline-secondary ml-2 mb-3" onClick={openUserManager}>
            👥 {t.open_user_manager || 'Open User Manager'}
          </button>
        </>
      )}
    </UserLayout>
  );
};

export default Settings;