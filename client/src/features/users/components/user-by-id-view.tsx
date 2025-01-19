'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { toast } from 'sonner';

import UserView from './user-view';
import { LoadingSpinner } from '@/components/spinner';
import UserService from '@/services/UserService';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { useSelector } from '@/hooks/use-redux';
import { isAdmin, isModerator } from '../rbac';

export default function UserViewPage() {
  const params = useParams<{ id: string }>();
  const currentUser = useSelector((state) => state.auth.user);

  const [exists, setExists] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getUserById(parseInt(params.id));
        setUser(response.data);
        document.title = `@${response.data.username} | MyFilmList`;
        setExists(true);
      } catch (error) {
        setExists(false);
        toast.error('Пользователь, которого вы ищете, не найден.');
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  if (exists === null || !mounted) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingSpinner className='h-1/2 w-auto max-w-md text-secondary' />
      </div>
    );
  }

  if (!exists) {
    return notFound();
  }

  if (!user) {
    return notFound();
  }

  const isCurrentUser = currentUser?.id === user.id;
  const canEdit = isCurrentUser || (!!currentUser && isAdmin(currentUser) && !isAdmin(user));
  const canDelete =
    isCurrentUser ||
    (!!currentUser &&
      (isAdmin(currentUser)
        ? !isAdmin(user)
        : isModerator(currentUser)
          ? !(isModerator(user) || isAdmin(user))
          : false));

  return (
    <UserView user={user} currentUser={isCurrentUser} canEdit={canEdit} canDelete={canDelete} />
  );
}
