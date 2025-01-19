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
    title: 'Пользователи',
    url: '/users',
    icon: 'users',
    shortcut: ['u', 'u'],
    isActive: false,
    items: [],
    pathPattern: /^\/users\/\d+$/
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
    url: '/auth/me',
    icon: 'user',
    shortcut: ['m', 'm'],
    isActive: true,
    items: []
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
  },
];

export const adminOnlyItems: NavItem[] = [
  {
    title: 'Фильмы',
    url: '#',
    icon: 'pizza',
    isActive: true,
    items: [
      {
        title: 'Создать фильм',
        url: '/movies/create',
        icon: 'add',
        shortcut: ['c', 'm']
      },
      {
        title: 'Обновить фильм',
        url: '/movies/update',
        icon: 'post',
        shortcut: ['u', 'm']
      }
    ]
  },
  {
    title: 'Коллекции',
    url: '#',
    icon: 'media',
    isActive: true,
    items: [
      {
        title: 'Создать коллекцию',
        url: '/watchlists/create',
        icon: 'add',
        shortcut: ['c', 'w']
      },
      {
        title: 'Обновить коллекцию',
        url: '/watchlists/update',
        icon: 'post',
        shortcut: ['u', 'w']
      }
    ]
  }
];

export const guestItems: NavItem[] = merge(navItems, guestOnlyItems, 'title');
export const authenticatedItems: NavItem[] = merge(navItems, authenticatedOnlyItems, 'title');
export const adminItems: NavItem[] = merge(authenticatedItems, adminOnlyItems, 'title');