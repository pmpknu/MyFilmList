import { NavItem } from 'types';

export function merge(a: NavItem[], b: NavItem[], prop: keyof NavItem) {
  var reduced = a.filter((aItem) => !b.find((bItem) => aItem[prop] === bItem[prop]));
  return reduced.concat(b);
}

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
    items: []
  }
];

export const authenticatedOnlyItems: NavItem[] = [
  {
    title: 'Учётная запись',
    url: '#',
    icon: 'user',
    isActive: true,
    items: [
      {
        title: 'Профиль',
        url: '/users/me',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ]
  }
];

export const guestOnlyItems: NavItem[] = [
  {
    title: 'Учётная запись',
    url: '#',
    icon: 'user',
    isActive: true,
    items: [
      {
        title: 'Вход',
        shortcut: ['l', 'l'],
        url: '/auth/sign-in',
        icon: 'login'
      },
      {
        title: 'Регистрация',
        shortcut: ['r', 'r'],
        url: '/auth/sign-up',
        icon: 'register'
      }
    ]
  }
];

export const guestItems: NavItem[] = merge(navItems, guestOnlyItems, 'title');
export const authenticatedItems: NavItem[] = merge(navItems, authenticatedOnlyItems, 'title');
