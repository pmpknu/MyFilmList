import { Metadata } from 'next';
import MovieUpdateViewPage from '@/features/movies/components/movie-update-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Обновление карточки фильма | MyFilmList',
  description: 'Страница обновления карточки существующего фильма.'
};

export default async function Page() {
  return <MovieUpdateViewPage />;
}
