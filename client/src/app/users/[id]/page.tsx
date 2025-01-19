import { Metadata } from 'next';
import UserViewPage from '@/features/users/components/user-by-id-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Загрузка... | MyFilmList',
  description: 'Страница пользователя.'
};

export default async function Page() {
  return <UserViewPage />;
}
