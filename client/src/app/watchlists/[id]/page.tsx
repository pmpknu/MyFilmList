import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';
import WatchlistViewPage from '@/features/watchlists/components/watchlist-view';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Обновление постера коллекции | MyFilmList',
  description: 'Страница обновления постера существующей коллекции.'
};

export default async function Page() {
  return <WatchlistViewPage />;
}
