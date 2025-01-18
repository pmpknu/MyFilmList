import { Metadata } from 'next';
import defaultMetadata from '@/constants/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Главная | MyFilmList'
};

export default async function Page() {
  return <div>Hello!</div>;
}
