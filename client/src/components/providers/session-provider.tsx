'use client';

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useDispatch } from '@/hooks/use-redux';

import AuthService from '@/services/AuthService';
import { login, logout } from '@/store/slices/auth-slice';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = AuthService.getAuth().user;

    if (user) {
      dispatch(login({ user }))
    }
    if (!user && AuthService.getAuth().accessToken) {
      AuthService.getCurrentUser()
        .then(response => {
          AuthService.setAuth(response.data);
          dispatch(login({ user: response.data.user }));
        })
        .catch(_error => {
          toast.error('Ошибка получения текущего пользователя.');
          dispatch(logout())
        });
    }
  }, []);

  return children;
}
