'use client';

import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { useSelector } from '@/hooks/use-redux';
import { Role } from '@/interfaces/role/model/UserRole';
import AuthService from '@/services/AuthService';
import ApiError from '@/lib/utils/ApiError';
import { extractSeconds } from '@/lib/utils/error-handling';

export default function ConfirmationReminder() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const [isEnabled, setEnabled] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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

  const resendConfirmation = () => {
    AuthService.resendConfirmation().catch((error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const err = axiosError.response.data as ApiError;

        const secondsLeft = extractSeconds(err.message);
        if (secondsLeft) {
          setEnabled(() => false);
          setTimeLeft(secondsLeft);
          setTimeout(function () {
            setEnabled(() => true);
          }, secondsLeft * 1000);

          toast.error(
            `Время между отправками подтверждений должно составлять не менее 1 минуты. Пожалуйста, попробуйте через ${secondsLeft} секунд.`
          );
        } else {
          toast.error(`Ошибка при повторной отправки подтверждения: ${err.message}.`);
        }
      } else {
        toast.error('Ошибка при повторной отправки подтверждения.');
      }
    });
  };

  return isAuthenticated && !user?.roles?.includes(Role.ROLE_USER) ? (
    <div className='flex h-6 rounded-md border border-yellow-500 bg-warning-foreground text-warning dark:border-warning'>
      <div className='flex items-center gap-2 whitespace-nowrap px-4 text-xs'>
        Подтвердите аккаунт по ссылке из письма.
        <span className='text-balance text-center'>
          {isEnabled ? (
            <span className='cursor-pointer [&_a]:underline hover:[&_a]:text-foreground'>
              <a onClick={() => resendConfirmation()}>Отправить еще раз</a>.
            </span>
          ) : (
            <span>Повторить через {timeLeft} секунд</span>
          )}
        </span>
      </div>
    </div>
  ) : (
    <></>
  );
}
