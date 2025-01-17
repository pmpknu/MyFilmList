import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Создание аккаунта | MyFilmList',
  description: 'Страница регистрации для аутентификации.'
};

export default async function Page() {
  return <SignUpViewPage />;
}
