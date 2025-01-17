import { Role } from '@/interfaces/role/model/UserRole';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { NavItem } from 'types';

export const hasAccess = (item: NavItem, user: UserDto | null | undefined): boolean => {
  return (
    !(item.requiresGuest && user) &&
    !(item.requiresRole && !user?.roles?.includes(item.requiresRole))
  );
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Feed',
    url: '/feed',
    icon: 'dashboard',
    shortcut: ['f', 'f'],
    isActive: false,
    items: []
  },
  {
    title: 'Учётная запись',
    url: '#',
    icon: 'user',
    isActive: true,
    items: [
      {
        title: 'Профиль',
        requiresRole: Role.ROLE_USER,

        url: '/users/me',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Вход',
        requiresGuest: true,
        shortcut: ['l', 'l'],
        url: '/auth/sign-in',
        icon: 'login'
      },
      {
        title: 'Регистрация',
        requiresGuest: true,
        shortcut: ['r', 'r'],
        url: '/auth/sign-up',
        icon: 'register'
      }
    ]
  }
];
