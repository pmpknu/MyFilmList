import RequestPasswordResetForm from './request-password-reset-form';

export default function RequestPasswordResetViewPage() {
  return (
    <div className='mt-12 flex h-auto flex-col items-center justify-center bg-background p-6 md:p-10'>
      <div className='mx-auto w-full max-w-xl'>
        <RequestPasswordResetForm />
      </div>
    </div>
  );
}
