'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import AuthService from '@/services/AuthService';
import { RootState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { AxiosError } from 'axios';
import ApiError from '@/lib/utils/ApiError';
import { extractSeconds } from '@/lib/utils/error-handling';

const formSchema = z.object({
  email: z
    .string({ required_error: 'Пожалуйста, заполните это поле.' })
    .nonempty({ message: 'Адрес электронной почты не может быть пустым.' })
    .min(1, { message: 'Пожалуйста, заполните это поле.' })
    .email({
      message:
        'Пожалуйста, введите действительный адрес электронной почты (например johndoe@domain.com).'
    })
});

export type RequestPasswordFormValue = z.infer<typeof formSchema>;

export default function RequestPasswordResetForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [loading, startTransition] = useTransition();
  const [mailSent, setMailSent] = useState<boolean>(false);
  const [isEnabled, setEnabled] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [lastSentEmail, setLastSentEmail] = useState<string | null>(null);

  const form = useForm<RequestPasswordFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  useEffect(() => {
    if (isUserAuthenticated) {
      toast.error('Вы уже вошли в аккаунт.');
      router.push('/');
    }
  }, [router, isUserAuthenticated]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }

    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const onSubmit = async (data: RequestPasswordFormValue) => {
    startTransition(async () => {
      try {
        await AuthService.requestPasswordReset(data.email);
        setMailSent(() => true);

        toast.success('Ссылка для сброса пароля отправлена на почту.');
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const err = axiosError.response.data as ApiError;

          if (err.status === 'TOO_MANY_REQUESTS') {
            setLastSentEmail(data.email);
            const secondsLeft = extractSeconds(err.message);
            if (secondsLeft) {
              setEnabled(() => false);
              setTimeLeft(secondsLeft);
              setTimeout(function () {
                setEnabled(() => true);
              }, secondsLeft * 1000);

              toast.error(`Пожалуйста, попробуйте через ${secondsLeft} секунд.`, {
                description:
                  'Время между отправками запросов на изменение пароля должно составлять не менее 1 минуты.'
              });
            } else {
              toast.error('Произошла ошибка.', { description: err.message });
            }
          } else if (err.status === 'NOT_FOUND') {
            form.setError('email', {
              type: 'manual',
              message: 'Этот адрес электронной почты недействителен.'
            });
            toast.error('Ошибка сброса пароля', {
              description: (
                <div>
                  Пользователь с адресом электронной почты{' '}
                  <span className='font-bold'>{data.email}</span> не найден.
                </div>
              )
            });
          } else {
            toast.error('Произошла ошибка.', { description: err.message });
          }
        } else {
          toast.error('Произошла ошибка.', {
            description: 'Ошибка при отправке ссылки для сброса пароля.'
          });
        }
      }
    });
  };

  return mailSent ? (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col items-center gap-2'>
          <h1 className='text-2xl font-bold'>Сброс пароля</h1>
          <p className='text-balance text-muted-foreground'>
            Проверьте свою электронную почту на наличие{' '}
            <span className='font-bold'>ссылки для сброса пароля</span>. Если оно не появится в
            течение нескольких минут, проверьте папку <span className='italic'>«Спам»</span>.
          </p>
        </div>
        <Button
          className='ml-auto w-full'
          onClick={() => router.push('/auth/sign-in')}
          variant='outline'
          size='lg'
        >
          <ArrowLeft className='mr-2' />
          Вернуться ко входу
        </Button>
      </div>
    </div>
  ) : (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2'>
              <h1 className='text-2xl font-bold'>Сброс пароля</h1>
              <p className='text-balance text-muted-foreground'>
                Введите подтвержденный адрес электронной почты вашей учетной записи, и мы вышлем вам
                ссылку для сброса пароля.
              </p>
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <FormLabel className='font-semibold'>Электронная почта</FormLabel>
                    <FormControl>
                      <Input
                        id='email'
                        type='email'
                        placeholder='johndoe@domain.com'
                        disabled={loading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className={form.formState.isValid && isEnabled ? '' : 'cursor-not-allowed'}>
              {isEnabled || form.getValues('email') !== lastSentEmail ? (
                <Button
                  disabled={loading || !form.formState.isValid}
                  className='ml-auto w-full'
                  type='submit'
                >
                  Отправить письмо для сброса пароля
                </Button>
              ) : (
                <Button disabled className='ml-auto w-full'>
                  Повторить через {timeLeft} секунд
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
