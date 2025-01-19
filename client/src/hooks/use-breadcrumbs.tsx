'use client';

import { UserDto } from '@/interfaces/user/dto/UserDto';
import UserService from '@/services/UserService';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export type BreadcrumbItem = {
  title: string;
  link: string;
  options?: {
    user?: UserDto;
  };
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  // Special pages
  '/privacy': [{ title: 'Политика конфиденциальности', link: '/privacy' }],
  '/terms-of-service': [{ title: 'Пользовательское соглашение', link: '/terms-of-service' }],

  // Authentication
  '/auth': [{ title: 'Учётная запись', link: '/auth' }],
  '/auth/me': [
    { title: 'Учётная запись', link: '#' },
    { title: 'Профиль', link: '/auth/me' }
  ],
  '/auth/sign-in': [
    { title: 'Учётная запись', link: '#' },
    { title: 'Вход', link: '/auth/sign-in' }
  ],
  '/auth/sign-up': [
    { title: 'Учётная запись', link: '#' },
    { title: 'Создание', link: '/auth/sign-up' }
  ],
  '/auth/confirm': [
    { title: 'Учётная запись', link: '#' },
    { title: 'Подтверждение', link: '/auth/confirm' }
  ],
  '/auth/request-password-reset': [
    { title: 'Учётная запись', link: '#' },
    { title: 'Восстановление доступа', link: '/auth/request-password-reset' }
  ],
  '/auth/reset-password': [
    { title: 'Учётная запись', link: '#' },
    { title: 'Изменение пароля', link: '/auth/reset-password' }
  ],

  // Users
  '/users': [{ title: 'Пользователи', link: '/users' }],

  // Stuff
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ]
};

// Function to fetch user data based on ID
async function fetchUser(userId: string): Promise<UserDto | null> {
  try {
    const response = await UserService.getUserById(parseInt(userId, 10));
    return response.data;
  } catch (error) {
    return null;
  }
}

function getUserName(user: UserDto | null): string {
  if (user?.username) {
    return `@${user.username}`;
  }
  return 'Пользователь не найден';
}

export function useBreadcrumbs() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserDto | null | undefined>(undefined);

  useEffect(() => {
    const loadUserName = async () => {
      if (pathname.startsWith('/users/')) {
        const userId = pathname.split('/')[2];
        setUser(await fetchUser(userId));
      }
    };
    loadUserName();
  }, [pathname]);

  const breadcrumbs = useMemo(() => {
    // Custom breadcrumbs for users
    if (pathname.startsWith('/users/')) {
      return [
        { title: 'Пользователи', link: '/users' },
        {
          title: user !== undefined ? getUserName(user) : 'Загрузка...',
          link: pathname,
          options: user ? { user: user } : undefined
        }
      ];
    }

    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname, user]);

  return breadcrumbs;
}
