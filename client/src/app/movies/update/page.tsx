import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';
import MovieUpdateSearchPage from '@/features/movies/components/movie-update-search-view';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Обновление карточки фильма | MyFilmList',
  description: 'Страница обновления карточки существующего фильма.'
};

export default async function Page() {
  return <MovieUpdateSearchPage />;
}
