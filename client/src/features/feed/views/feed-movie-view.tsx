import { FeedMovieForm } from '../forms/feed-movie-form';

export default function FeedMovieView() {
  return (
    <div className='flex h-auto flex-col items-center justify-center bg-background p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl'>
        <FeedMovieForm />
      </div>
    </div>
  );
}
