'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import AuthService from '@/services/AuthService';
import { RootState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import * as z from 'zod';
import { AxiosError } from 'axios';
import PasswordForm from '@/components/forms/password-form';

const formSchema = z
  .object({
    password: z
      .string({ required_error: 'Пожалуйста, заполните это поле.' })
      .min(6, { message: 'Длина пароля должна быть от 6 до 127' })
      .max(127, { message: 'Длина пароля должна быть от 6 до 127' })
      .nonempty({ message: 'Пароль не может быть пустым' }),
    confirmPassword: z
      .string({ required_error: 'Пожалуйста, заполните это поле.' })
      .min(6, { message: 'Длина пароля должна быть от 6 до 127' })
      .max(127, { message: 'Длина пароля должна быть от 6 до 127' })
      .nonempty({ message: 'Пароль не может быть пустым' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  });

export type ResetPasswordFormValue = z.infer<typeof formSchema>;

export default function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [loading, startTransition] = useTransition();
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('password_reset_token');

  const form = useForm<ResetPasswordFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (isUserAuthenticated && !requestSent) {
      toast.error('Вы уже вошли в аккаунт.');
      router.push('/');
    }
  }, [router, isUserAuthenticated, requestSent]);

  useEffect(() => {
    if (!token) {
      toast.error('Ошибка изменения пароля.', {
        description: 'Токен не обнаружен.'
      });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValue) => {
    startTransition(async () => {
      try {
        await AuthService.resetPassword(token as string, data.password);
        setRequestSent(true);

        toast.success('Пароль успешно изменен.', {
          description: 'Данные для входа в аккаунт успешно изменены.'
        });
        router.push('/auth/sign-in');
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          toast.error('Ошибка при при изменении пароля', {
            description:
              'Ссылка на изменение пароля истекла или не найдена. Попробуйте запросить изменение пароля аккаунт еще раз.'
          });
        } else {
          toast.error('Произошла ошибка.', {
            description: 'Ошибка при при изменении пароля.'
          });
        }
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2'>
              <h1 className='text-2xl font-bold'>Смена пароля</h1>
              <p className='text-balance text-center text-muted-foreground'>
                Придумайте новый пароль, чтобы обновить данные для входа в учётную запись.
              </p>
            </div>

            <PasswordForm
              form={form}
              loading={loading}
              forgetPassword={false}
              title='Новый пароль'
            />
            <PasswordForm
              form={form}
              loading={loading}
              forgetPassword={false}
              name='confirmPassword'
              title='Подтвердите пароль'
            />

            <div className={form.formState.isValid ? '' : 'cursor-not-allowed'}>
              <Button
                disabled={loading || !form.formState.isValid}
                className='ml-auto w-full'
                type='submit'
              >
                Изменить пароль
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
