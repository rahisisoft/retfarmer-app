import React from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import UserAdmin from '@/components/UserAdmin';
import UserLayout from '@/components/UserLayout';

const UsersPage = () => {
  return (
    <UserLayout>
  <UserAdmin />
  </UserLayout>
  );
}
export default UsersPage;