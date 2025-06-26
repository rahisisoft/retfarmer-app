import React from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import TranslationAdmin from '@/components/TranslationAdmin';
import UserLayout from '@/components/UserLayout';

const TranslationsPage = () => {
  return (
    <UserLayout>
  <TranslationAdmin />
  </UserLayout>
  );
}
export default TranslationsPage;