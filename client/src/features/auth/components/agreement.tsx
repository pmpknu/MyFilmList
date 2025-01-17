'use client';

export default function Agreement() {
  return (
    <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
      Нажимая «Продолжить», вы соглашаетесь с нашими{' '}
      <a href='/terms-of-service'>Условиями обслуживания</a> и{' '}
      <a href='/privacy'>Политикой конфиденциальности</a>.
    </div>
  );
}
