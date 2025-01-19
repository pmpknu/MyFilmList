'use client';

import { useState } from 'react';
import { HeartCrack } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// TODO
export default function DeleteUserDialog({
  user,
  handleSubmit
}: {
  user: UserDto;
  handleSubmit: (onAllDevices: boolean) => void;
}) {
  const [checked, setChecked] = useState<boolean>(false);
  const handleClick = () => setChecked(!checked);

  return (
    <AlertDialogContent aria-labelledby='sign-out-dialog-title'>
      <AlertDialogHeader>
        <AlertDialogTitle id='sign-out-dialog-title'>
          Вы уверены, что хотите выйти из учетной записи?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Обязательно возвращайтесь,{' '}
          <a
            className='text-blue-600 hover:underline dark:text-blue-500'
            href={`/users/${user.id}`}
          >
            @{user.username}
          </a>
          !
          <br />
          Мы будем по вас скучать...{' '}
          <HeartCrack className='mb-1 inline-flex h-4 w-4 text-destructive' />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Separator />
      <div className='items-top flex space-x-2'>
        <Checkbox onClick={handleClick} checked={checked} />
        <div className='grid gap-1.5 leading-none'>
          <label
            onClick={handleClick}
            htmlFor='terms1'
            className='cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Выйти из аккаунта на всех устройствах
          </label>
          <p className='text-sm text-muted-foreground'>
            Для повторного получения доступа потребуется заново ввести свои учетные данные.
          </p>
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction onClick={async () => await handleSubmit(checked)}>
          Выйти
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
