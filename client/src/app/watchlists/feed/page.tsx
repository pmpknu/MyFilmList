import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';
import FeedWatchListView from '@/features/feed/views/feed-watchlist-view';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Рекомендации коллекций | MyFilmList',
  description: 'Страница рекомендаций коллекций.'
};

export default async function Page() {
  return <FeedWatchListView />;
}
