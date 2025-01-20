import { Metadata } from 'next';
import WatchlistUpdateViewPage from '@/features/watchlists/components/watchlist-update-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Обновление карточки коллекции | MyFilmList',
  description: 'Страница обновления карточки существующей коллекции.'
};

export default async function Page() {
  return <WatchlistUpdateViewPage />;
}
