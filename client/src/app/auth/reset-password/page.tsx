import { Metadata } from 'next';
import ResetPasswordViewPage from '@/features/auth/components/reset-password-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Изменение пароля | MyFilmList',
  description: 'Изменение пароля учётной записи.'
};

export default async function Page() {
  return <ResetPasswordViewPage />;
}
