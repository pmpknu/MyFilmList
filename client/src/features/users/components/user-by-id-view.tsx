'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { toast } from 'sonner';

import UserView from './user-view';
import { LoadingSpinner } from '@/components/spinner';
import UserService from '@/services/UserService';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { useSelector } from '@/hooks/use-redux';
import { isAdmin, isModerator, isUser } from '../rbac';
import { Role } from '@/interfaces/role/model/UserRole';

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

  type UserRole = 'admin' | 'moderator' | 'user' | 'guest';
  const rolePermissions: Record<UserRole, { canAdd: Role[]; canDelete: Role[] }> = {
    admin: {
      canAdd: [Role.ROLE_USER, Role.ROLE_MODERATOR, Role.ROLE_ADMIN],
      canDelete: [Role.ROLE_USER, Role.ROLE_MODERATOR]
    },
    moderator: {
      canAdd: [Role.ROLE_USER],
      canDelete: [Role.ROLE_USER]
    },
    user: {
      canAdd: [],
      canDelete: []
    },
    guest: {
      canAdd: [],
      canDelete: []
    }
  };

  const currentUserRole: UserRole = !currentUser
    ? 'guest'
    : isAdmin(currentUser)
      ? 'admin'
      : isModerator(currentUser)
        ? 'moderator'
        : 'user';

  const getRoleActions = (
    currentUserRole: UserRole,
    targetUserRoles: Role[]
  ): { canAdd: Role[]; canDelete: Role[] } => {
    const permissions = rolePermissions[currentUserRole];

    const canAdd = permissions.canAdd.filter((role) => !targetUserRoles.includes(role));
    const canDelete = permissions.canDelete.filter((role) => targetUserRoles.includes(role));

    return { canAdd, canDelete };
  };

  const targetUserRoles: Role[] = user.roles;
  const { canAdd: canAddRoles, canDelete: canDeleteRoles } =
    isCurrentUser || isAdmin(user)
      ? { canAdd: [], canDelete: [] }
      : getRoleActions(currentUserRole, targetUserRoles);
  const canDelete =
    isCurrentUser ||
    (!!currentUser &&
      (isAdmin(currentUser)
        ? !isAdmin(user)
        : isModerator(currentUser)
          ? !(isModerator(user) || isAdmin(user))
          : false));

  return (
    <UserView
      user={user}
      currentUser={isCurrentUser}
      canEdit={canEdit}
      canDelete={canDelete}
      canAddRoles={canAddRoles}
      canDeleteRoles={canDeleteRoles}
    />
  );
}
