import { Metadata } from 'next';
import CurrentUserViewPage from '@/features/users/components/current-user-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Профиль | MyFilmList',
  description: 'Профиль текущего пользователя.'
};

export default async function Page() {
  return <CurrentUserViewPage />;
}
