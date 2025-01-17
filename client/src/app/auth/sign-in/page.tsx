import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Вход в аккаунт | MyFilmList',
  description: 'Страница входа для аутентификации.',
};

export default async function Page() {
  return <SignInViewPage />;
}
