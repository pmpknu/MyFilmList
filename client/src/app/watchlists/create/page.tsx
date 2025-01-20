import { Metadata } from 'next';
import WatchlistCreateViewPage from '@/features/watchlists/components/watchlist-create-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Создание карточки коллекции | MyFilmList',
  description: 'Страница создания карточки будующей коллекции.'
};

export default async function Page() {
  return <WatchlistCreateViewPage />;
}
