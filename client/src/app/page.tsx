import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';
import FeedMovieView from '@/features/feed/views/feed-movie-view';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Рекомендации | MyFilmList',
  description: 'Страница рекомендаций фильмов.'
};

export default async function Page() {
  return <FeedMovieView />;
}
