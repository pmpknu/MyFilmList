'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';

export default function PasswordForm({
  form,
  loading,
  forgetPassword,
  name = 'password',
  title = 'Пароль'
}: {
  form: UseFormReturn<any>;
  loading: boolean;
  forgetPassword: boolean;
  name?: string;
  title?: string;
}) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <FormLabel className='font-semibold'>{title}</FormLabel>
              {forgetPassword && (
                <a
                  href='/auth/request-password-reset'
                  className='ml-auto text-sm underline-offset-2 hover:underline'
                >
                  Забыли пароль?
                </a>
              )}
            </div>
            <FormControl>
              <div className='relative'>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  disabled={loading}
                  className='hide-password-toggle pr-10'
                  required
                  {...field}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 py-2'
                  onClick={() => setPasswordVisible((prev) => !prev)}
                >
                  {isPasswordVisible ? (
                    <Eye className='h-4 w-4 cursor-pointer text-gray-500' aria-hidden='true' />
                  ) : (
                    <EyeOff className='h-4 w-4 cursor-pointer text-gray-500' aria-hidden='true' />
                  )}
                  <span className='sr-only'>
                    {isPasswordVisible ? 'Спрятать пароль' : 'Показать пароль'}
                  </span>
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
