'use client';
import Image from 'next/image';

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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SignInDto } from '@/interfaces/auth/dto/SignInDto';
import AuthService from '@/services/AuthService';
import { RootState } from '@/store';
import { login } from '@/store/slices/auth-slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import * as z from 'zod';
import PasswordForm from '@/components/forms/password-form';
import Agreement from './agreement';

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Имя пользователя должно содержать от 3 до 63 символов' })
    .max(63, { message: 'Имя пользователя должно содержать от 3 до 63 символов' })
    .nonempty({ message: 'Имя пользователя не может быть пустым' }),

  password: z
    .string()
    .min(6, { message: 'Длина пароля должна быть от 6 до 127' })
    .max(127, { message: 'Длина пароля должна быть от 6 до 127' })
    .nonempty({ message: 'Пароль не может быть пустым' })
});

export type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm({ className, ...props }: React.ComponentProps<'div'>) {
  const dispatch = useDispatch();
  const router = useRouter();

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  useEffect(() => {
    if (isUserAuthenticated && !requestSent) {
      router.push(callbackUrl ?? '/');
      toast.error('Вы уже вошли в аккаунт.');
    }
  }, [router, isUserAuthenticated, requestSent]);

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        const response = await AuthService.login(data as SignInDto);
        setRequestSent(true);

        AuthService.setAuth(response.data);
        dispatch(login({ user: response.data.user }));

        toast.success('Вход в аккаунт прошел успешно!');
        router.push(callbackUrl ?? '/');
      } catch (error) {
        toast.error('Ошибка входа. Пожалуйста, проверьте ваши учетные данные.');
      }
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Вход</h1>
                  <p className='text-balance text-muted-foreground'>
                    Войдите в свою учетную запись MyFilmList
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <div className='grid gap-2'>
                        <FormLabel className='font-semibold'>Имя пользователя</FormLabel>
                        <FormControl>
                          <Input
                            id='username'
                            type='text'
                            placeholder='my_username123'
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
                <PasswordForm form={form} loading={loading} forgetPassword />
                <Button disabled={loading} className='ml-auto w-full' type='submit'>
                  Войти
                </Button>
                <div className='text-center text-sm'>
                  Нет аккаунта?{' '}
                  <a href='/auth/sign-up' className='underline underline-offset-4'>
                    Зарегистрируйтесь
                  </a>
                </div>
              </div>
            </form>
          </Form>
          <div className='relative hidden bg-muted md:block'>
            <Image
              src={`/static/sign-in/poster-light.jpg`}
              alt='Movie Time!'
              priority
              width={720}
              height={720}
              className='absolute inset-0 h-full w-full object-cover dark:hidden'
            />
            <Image
              src={`/static/sign-in/poster-dark.jpg`}
              alt='Movie Time!'
              priority
              width={735}
              height={735}
              className='absolute inset-0 hidden h-full w-full object-cover dark:block'
            />
          </div>
        </CardContent>
      </Card>
      <Agreement />
    </div>
  );
}
