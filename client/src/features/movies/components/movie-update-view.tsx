import MovieUpdateForm from '../movie-update-form';

export default function MovieCreateViewPage() {
  return (
    <div className='flex h-auto flex-col items-center justify-center bg-background p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl'>
        <MovieUpdateForm />
      </div>
    </div>
  );
}
