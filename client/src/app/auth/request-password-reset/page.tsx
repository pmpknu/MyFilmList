import { Metadata } from 'next';
import RequestPasswordResetViewPage from '@/features/auth/components/request-password-reset-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Восстановление доступа | MyFilmList',
  description: 'Восстановление доступа к учётной записи MyFilmList.'
};

export default async function Page() {
  return <RequestPasswordResetViewPage />;
}
