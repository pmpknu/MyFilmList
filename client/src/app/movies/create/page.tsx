import { Metadata } from 'next';
import MovieCreateViewPage from '@/features/movies/components/movie-create-view';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Создание карточки фильма | MyFilmList',
  description: 'Страница создания карточки будущего фильма.'
};

export default async function Page() {
  return <MovieCreateViewPage />;
}
