import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';
import WatchlistPosterUpdateViewPage from '@/features/watchlists/components/watchlist-poster-update-view';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Обновление постера коллекции | MyFilmList',
  description: 'Страница обновления постера существующей коллекции.'
};

export default async function Page() {
  return <WatchlistPosterUpdateViewPage />;
}
