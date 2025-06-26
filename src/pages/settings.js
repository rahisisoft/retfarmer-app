import React, { useContext } from 'react';
import UserLayout from '@/components/UserLayout';
import { LanguageContext } from '@/contexts/LanguageContext';
import { useRouter } from 'next/router';
import { useTranslation } from '@/hooks/useTranslation';

const Settings = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation('settings');
  const router = useRouter();

  const flags = {
    en: { name: "English", icon: "🇬🇧" },
    fr: { name: "Français", icon: "🇫🇷" },
    rn: { name: "Kirundi", icon: "🇧🇮" },
    sw: { name: "Swahili", icon: "🇹🇿" }
  };

  const openTranslations = () => {
    router.push('/translations');  // adapte si besoin
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

      <button className="btn btn-outline-primary mb-4" onClick={openTranslations}>
        ⚙️ {t.open_translation_manager}
      </button>
    </UserLayout>
  );
};

export default Settings;
