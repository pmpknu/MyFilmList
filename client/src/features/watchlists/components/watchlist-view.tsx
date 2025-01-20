import PageContainer from '@/components/layout/page-container';
import WatchlistForm from '../watchlist-form';

export default function MovieViewPage() {
  return (
    <PageContainer>
      <div className='container mx-auto max-w-5xl p-4'>
        <WatchlistForm />
      </div>
    </PageContainer>
  );
}
