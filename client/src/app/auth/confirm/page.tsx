import { Metadata } from 'next';
import ConfirmViewPage from '@/features/auth/components/confirm-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Подтверждение учётной записи | MyFilmList',
  description: 'Подождите, пока мы проверим вашу учётную запись...'
};

export default async function Page() {
  return <ConfirmViewPage />;
}
