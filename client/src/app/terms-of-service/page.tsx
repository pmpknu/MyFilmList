import { Metadata } from 'next';
import TermsOfServicePage from '@/features/terms-of-service/components/terms-of-service-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Пользовательское соглашение | MyFilmList',
  description: 'Пользовательское соглашение MyFilmList.'
};

export default async function Page() {
  return <TermsOfServicePage />;
}
