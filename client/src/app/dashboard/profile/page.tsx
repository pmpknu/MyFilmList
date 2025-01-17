import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';
import ProfileViewPage from '@/features/profile/components/profile-view-page';
import defaultMetadata from '@/constants/metadata';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Профиль | MyFilmList',
};

export default async function Page({ searchParams }: pageProps) {
  return <ProfileViewPage />;
}
