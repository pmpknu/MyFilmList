import { NavItem } from 'types';

export function merge(a: NavItem[], b: NavItem[], prop: keyof NavItem) {
  const merged = [...a];

  b.forEach((bItem) => {
    const existingIndex = merged.findIndex((aItem) => aItem[prop] === bItem[prop]);

    if (existingIndex !== -1) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...bItem
      };
    } else {
      merged.push(bItem);
    }
  });

  return merged;
}

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Лента',
    url: '/',
    icon: 'dashboard',
    shortcut: ['f', 'f'],
    isActive: false,
    items: []
  },
  {
    title: 'Фильмы',
    url: '/movies',
    icon: 'popcorn',
    shortcut: ['m', 'm'],
    isActive: true,
    items: [],
    pathPattern: /^\/movies\/\d+$/
  },
  {
    title: 'Коллекции',
    url: '/watchlists',
    icon: 'library',
    shortcut: ['w', 'w'],
    isActive: true,
    items: [],
    pathPattern: /^\/watchlists\/\d+$/
  },
  {
    title: 'Учётная запись',
    url: '#',
    icon: 'user',
    isActive: true,
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
  }
];

export const authenticatedOnlyItems: NavItem[] = [
  {
    title: 'Учётная запись',
    url: '/auth/me',
    icon: 'user',
    shortcut: ['a', 'a'],
    isActive: true,
    items: []
  }
];

export const adminOnlyItems: NavItem[] = [
  {
    title: 'Фильмы',
    url: '#',
    icon: 'popcorn',
    shortcut: ['m', 'm'],
    isActive: false,
    pathPattern: /^\/movies\/\d+$/,
    items: [
      {
        title: 'Фильмы',
        url: '/movies',
        icon: 'film',
        shortcut: ['m', 'l']
      },
      {
        title: 'Создать фильм',
        url: '/movies/create',
        icon: 'add',
        shortcut: ['m', 'c']
      },
      {
        title: 'Обновить фильм',
        url: '/movies/update',
        icon: 'post',
        shortcut: ['m', 'u']
      }
    ]
  },
  {
    title: 'Коллекции',
    url: '#',
    icon: 'library',
    shortcut: ['w', 'w'],
    isActive: true,
    items: [
      {
        title: 'Рекомендации',
        url: '/watchlists/feed',
        icon: 'dashboard',
        shortcut: ['w', 'f']
      },
      {
        title: 'Коллекции',
        url: '/watchlists',
        icon: 'post',
        shortcut: ['w', 'l']
      },
      {
        title: 'Создать коллекцию',
        url: '/watchlists/create',
        icon: 'add',
        shortcut: ['w', 'c']
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
export const adminItems: NavItem[] = merge(authenticatedItems, adminOnlyItems, 'title');
