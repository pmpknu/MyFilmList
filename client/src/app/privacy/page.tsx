import { Metadata } from 'next';
import PrivacyPolicyPage from '@/features/privacy/components/privacy-policy-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Политика конфиденциальности | MyFilmList',
  description: 'Политика конфиденциальности MyFilmList.'
};

export default async function Page() {
  return <PrivacyPolicyPage />;
}
