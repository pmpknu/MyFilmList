'use client';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import * as z from 'zod';

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
import AuthService from '@/services/AuthService';
import { RootState } from '@/store';
import { register } from '@/store/slices/auth-slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import PasswordForm from '@/components/forms/password-form';
import { SignUpDto } from '@/interfaces/auth/dto/SignUpDto';
import ApiError from '@/lib/utils/ApiError';
import Agreement from './agreement';

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Имя пользователя должно содержать от 3 до 63 символов.' })
    .max(63, { message: 'Имя пользователя должно содержать от 3 до 63 символов.' })
    .nonempty({ message: 'Имя пользователя не может быть пустым.' }),

  email: z
    .string({ required_error: 'Пожалуйста, заполните это поле.' })
    .nonempty({ message: 'Адрес электронной почты не может быть пустым.' })
    .min(1, { message: 'Пожалуйста, заполните это поле.' })
    .email({
      message:
        'Пожалуйста, введите действительный адрес электронной почты (например johndoe@domain.com).'
    }),

  password: z
    .string({ required_error: 'Пожалуйста, заполните это поле.' })
    .min(6, { message: 'Длина пароля должна быть от 6 до 127' })
    .max(127, { message: 'Длина пароля должна быть от 6 до 127' })
    .nonempty({ message: 'Пароль не может быть пустым' })
});

export type UserRegistrationFormValue = z.infer<typeof formSchema>;

export default function UserRegistrationForm({ className, ...props }: React.ComponentProps<'div'>) {
  const dispatch = useDispatch();
  const router = useRouter();

  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();

  const form = useForm<UserRegistrationFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (isUserAuthenticated && !requestSent) {
      router.push(callbackUrl ?? '/');
      toast.error('Вы уже вошли в аккаунт.');
    }
  }, [router, isUserAuthenticated, requestSent]);

  const onSubmit = async (data: UserRegistrationFormValue) => {
    startTransition(async () => {
      try {
        const response = await AuthService.register(data as SignUpDto);
        setRequestSent(true);

        AuthService.setAuth(response.data);
        dispatch(register(response.data));

        toast.success('Аккаунт успешно создан!');
        router.push(callbackUrl ?? '/');
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const err = axiosError.response.data as ApiError;
          toast.error(`Ошибка создания аккаунта: ${err.message}.`);
        } else {
          toast.error(`Ошибка создания аккаунта.`);
        }
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
                  <h1 className='text-2xl font-bold'>Регистрация</h1>
                  <p className='text-balance text-muted-foreground'>
                    Создайте учётную запись MyFilmList
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
                            placeholder='johndoe'
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
                <PasswordForm form={form} loading={loading} forgetPassword={false} />
                <Button disabled={loading} className='ml-auto w-full' type='submit'>
                  Создать аккаунт
                </Button>
                <div className='text-center text-sm'>
                  Уже есть аккаунт?{' '}
                  <a href='/auth/sign-in' className='underline underline-offset-4'>
                    Войти в учётную запись
                  </a>
                </div>
              </div>
            </form>
          </Form>
          <div className='relative hidden bg-muted md:block'>
            <Image
              src={`/static/sign-up/poster-light.jpg`}
              alt='Movie Time!'
              priority
              width={720}
              height={720}
              className='absolute inset-0 h-full w-full object-cover dark:hidden'
            />
            <Image
              src={`/static/sign-up/poster-dark.jpg`}
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
