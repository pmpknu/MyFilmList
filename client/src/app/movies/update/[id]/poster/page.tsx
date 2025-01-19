import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';
import MoviePosterUpdateViewPage from '@/features/movies/components/movie-poster-update-view';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Обновление постера фильма | MyFilmList',
  description: 'Страница обновления постера существующего фильма.'
};

export default async function Page() {
  return <MoviePosterUpdateViewPage />;
}
