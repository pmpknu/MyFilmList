'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { adminItems, authenticatedItems, guestItems, navItems } from '@/constants/navigation';
import { ChevronRight, ChevronsUpDown, ClipboardCopy, LogOut } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Icons } from '../icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import AuthService from '@/services/AuthService';
import { logout } from '@/store/slices/auth-slice';
import { cn } from '@/lib/utils';
import SignOutDialog from '@/features/auth/components/sign-out-dialog';
import { getAvatarSvg } from '@/features/users/components/avatar/generator';
import { NavItem } from 'types';
import { isAdmin } from '@/features/users/rbac';
import { useTheme } from 'next-themes';

export const company = {
  name: 'MFL',
  logo: Icons.logotype,
  plan: 'MyFilmList'
};

export default function AppSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const { theme } = useTheme();

  const user = useSelector((state: RootState) => state.auth.user);

  const [mounted, setMounted] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [callbackUrl, setCallbackUrl] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    setCallbackUrl(window.location.href);
  }, []);

  const getItems = (): NavItem[] => {
    if (mounted) {
      if (user) {
        return isAdmin(user) ? adminItems : authenticatedItems;
      }
      return guestItems;
    }
    return navItems;
  };

  const handleSubmit = async (onAllDevices: boolean) => {
    router.push('/');
    toast.success('Вы успешно вышли из аккаунта!');
    setTimeout(async () => {
      await AuthService.signOut(onAllDevices);
      AuthService.forgetAuth();
      dispatch(logout());
    }, 500);
  };

  const handleCopyLink = (e?: React.UIEvent<HTMLDivElement>) => {
    e?.preventDefault();
    toast.info('Ссылка скопирована в буфер обмена', {
      description: 'Теперь вы можете вставить её в любом месте, где это необходимо.',
      duration: 2000
    });
    const usersUrl = `${window.location.origin}/users/${user?.id}`;
    navigator.clipboard.writeText(usersUrl).then(() => {
      setCopySuccess(true);
      if (!copySuccess) {
        setTimeout(() => setCopySuccess(false), 2000);
      }
    });
  };

  const checkPathname = (item: NavItem) =>
    pathname === item.url || (item.pathPattern ? item.pathPattern.test(pathname) : false);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex gap-2 py-2 text-sidebar-accent-foreground'>
          <a href='/'>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <company.logo className='size-4' />
            </div>
          </a>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>{company.name}</span>
            <span className='truncate text-xs'>{company.plan}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Обзор</SidebarGroupLabel>
          <SidebarMenu>
            {getItems().map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              const subItems = item?.items?.map((i) => {
                if (i.url.endsWith('sign-in') || i.url.endsWith('sign-up')) {
                  return {
                    ...i,
                    url: `${i.url}?callbackUrl=${callbackUrl}`
                  };
                }
                return i;
              });

              return subItems && subItems?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={checkPathname(item)}>
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subItems?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={checkPathname(subItem)}>
                              <Link href={subItem.url}>
                                {subItem.icon
                                  ? React.createElement(Icons[subItem.icon])
                                  : React.createElement(Icons.square)}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={checkPathname(item)}>
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {state === 'expanded' && (
            <>
              <SidebarMenuItem className='px-4'>
                <div className='truncate text-center text-xs text-muted-foreground [&_a]:underline-offset-4 hover:[&_a]:text-foreground hover:[&_a]:underline'>
                  <Link href='/terms-of-service'>Пользовательское соглашение</Link>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem className={cn('px-4', user ? '' : 'pb-12')}>
                <div className='truncate text-center text-xs text-muted-foreground [&_a]:underline-offset-4 hover:[&_a]:text-foreground hover:[&_a]:underline'>
                  <Link href='/privacy'>Политика конфиденциальности</Link>
                </div>
              </SidebarMenuItem>
            </>
          )}
          {user && (
            <SidebarMenuItem>
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size='lg'
                      className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                    >
                      <Avatar className='h-8 w-8 rounded-full'>
                        <AvatarImage src={user.photo} alt={user.username} />
                        <AvatarFallback
                          className='rounded-full'
                          dangerouslySetInnerHTML={{
                            __html: getAvatarSvg(user.username, theme).toString()
                          }}
                        />
                      </Avatar>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>{user.username}</span>
                        <span className='truncate text-xs'>{user.email}</span>
                      </div>
                      <ChevronsUpDown className='ml-auto size-4' />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                    side='bottom'
                    align='end'
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className='p-0 font-normal'>
                      <a href='/auth/me'>
                        <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                          <Avatar className='h-8 w-8 rounded-full'>
                            <AvatarImage src={user.photo} alt={user.username} />
                            <AvatarFallback
                              className='rounded-full'
                              dangerouslySetInnerHTML={{
                                __html: getAvatarSvg(user.username, theme).toString()
                              }}
                            />
                          </Avatar>
                          <div className='grid flex-1 text-left text-sm leading-tight'>
                            <span className='truncate font-semibold'>{user.username}</span>
                            <span className='truncate text-xs'> {user.email}</span>
                          </div>
                        </div>
                      </a>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onClick={handleCopyLink}>
                        <ClipboardCopy className='mr-4 h-4 w-4 text-gray-500' />
                        {copySuccess ? 'Cкопировано!' : 'Скопировать'}
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem>
                        <LogOut className='mr-4 h-4 w-4 text-gray-500' />
                        Выйти
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <SignOutDialog user={user} handleSubmit={handleSubmit} />
              </AlertDialog>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
