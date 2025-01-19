'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useDispatch, useSelector } from '@/hooks/use-redux';
import AuthService from '@/services/AuthService';
import { login } from '@/store/slices/auth-slice';
import UserView from './user-view';
import { LoadingSpinner } from '@/components/spinner';

export default function CurrentUserViewPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [hasAccess, setHasAccess] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((response) => {
        AuthService.setAuth(response.data);
        dispatch(login({ user: response.data.user }));
        setHasAccess(true);
      })
      .catch((_error) => {
        toast.error('Ошибка получения текущего пользователя.');
        router.push('/auth/sign-in');
      });
  }, [router]);

  if (!hasAccess) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingSpinner className='h-1/2 w-auto max-w-md text-secondary' />
      </div>
    );
  }

  return <UserView user={user!} currentUser canEdit canDelete />;
}
