import ResetPasswordForm from './reset-password-form';

export default function ResetPasswordViewPage() {
  return (
    <div className='mt-12 flex h-auto flex-col items-center justify-center bg-background p-6 md:p-10'>
      <div className='mx-auto w-full max-w-xl'>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
