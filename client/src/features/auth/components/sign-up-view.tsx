import UserRegistrationForm from './user-registration-form';

export default function SignUpViewPage() {
  return (
    <div className='mt-12 flex h-auto flex-col items-center justify-center bg-background p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl'>
        <UserRegistrationForm />
      </div>
    </div>
  );
}
