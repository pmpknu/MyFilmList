import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';
import WatchlistSearchPage from '@/features/watchlists/components/watchlist-update-search-view';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Мои коллекции | MyFilmList',
  description: 'Страница получения коллекций пользователя.'
};

export default async function Page() {
  return <WatchlistSearchPage />;
}
