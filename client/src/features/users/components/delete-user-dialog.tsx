'use client';

import { useEffect, useState } from 'react';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { Separator } from '@/components/ui/separator';

function DeleteCurrentUserDialog({
  user,
  isOpen,
  setOpen,
  handleSubmit
}: {
  user: UserDto;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  handleSubmit: () => void;
}) {
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

  useEffect(() => {
    setTimeLeft(10);
    setOpen(false);
  }, [isOpen]);

  return (
    <AlertDialogContent className='max-w-xl' aria-labelledby='sign-out-dialog-title'>
      <AlertDialogHeader>
        <AlertDialogTitle id='sign-out-dialog-title'>
          Ты уверен, что хочешь нас покинуть? 😭
        </AlertDialogTitle>
        <AlertDialogDescription>
          <div className='pb-4 pt-2'>
            Удаление аккаунта означает{' '}
            <span className='font-bold text-destructive'>потерю всех данных и воспоминаний</span>,
            связанных с нашим общением и твоим вкладом в{' '}
            <span className='font-bold'>MyFilmList</span>.
          </div>
          <div className='pb-4'>
            Подумай еще немного, и, если ты всё же решишь уйти, нажми на кнопку ниже.
          </div>
          Мы будем скучать и всегда будем рады твоему возвращению,{' '}
          <a
            className='font-bold text-blue-600 hover:underline dark:text-blue-500'
            href={`/users/${user.id}`}
          >
            @{user.username}
          </a>{' '}
          💔!
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Separator />
      <AlertDialogFooter className='flex w-full gap-2'>
        <AlertDialogCancel
          autoFocus
          className='w-1/2 border border-secondary-foreground text-center hover:border-primary-foreground'
        >
          Отмена
        </AlertDialogCancel>
        {timeLeft ? (
          <AlertDialogAction
            onClick={(e) => e.preventDefault()}
            className='w-1/2 cursor-not-allowed border border-muted-foreground bg-muted text-center text-muted-foreground hover:bg-muted hover:text-destructive-foreground'
          >
            Удалить через {timeLeft} секунд{timeLeft < 10 ? '\u00A0' : ''}
          </AlertDialogAction>
        ) : (
          <AlertDialogAction
            onClick={handleSubmit}
            className='w-1/2 border border-destructive bg-background text-center text-destructive hover:border-destructive-foreground hover:bg-destructive hover:text-destructive-foreground'
          >
            Удалить
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export default function DeleteUserDialog({
  user,
  isOpen,
  setOpen,
  currentUser,
  handleSubmit
}: {
  user: UserDto;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  currentUser: boolean;
  handleSubmit: () => void;
}) {
  if (currentUser) {
    return (
      <DeleteCurrentUserDialog
        user={user}
        isOpen={isOpen}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
      />
    );
  }

  return (
    <AlertDialogContent className='max-w-sm' aria-labelledby='sign-out-dialog-title'>
      <AlertDialogHeader>
        <AlertDialogTitle id='sign-out-dialog-title'>
          Вы действительно хотите удалить пользователя{' '}
          <a
            className='font-bold text-blue-600 hover:underline dark:text-blue-500'
            href={`/users/${user.id}`}
          >
            @{user.username}
          </a>
          ?
        </AlertDialogTitle>
        <AlertDialogDescription>
          <div className='py-2'>
            Учтите, что после подтверждения это действие уже нельзя будет отменить.
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Separator />
      <AlertDialogFooter className='flex w-full gap-2'>
        <AlertDialogCancel
          autoFocus
          className='w-1/2 border border-secondary-foreground text-center hover:border-primary-foreground'
        >
          Отмена
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleSubmit}
          className='w-1/2 border border-destructive bg-background text-center text-destructive hover:border-destructive-foreground hover:bg-destructive hover:text-destructive-foreground'
        >
          Удалить
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
