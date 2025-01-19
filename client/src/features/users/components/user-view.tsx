'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { MoreVertical, Edit, ShieldAlert, Trash, UserCheck } from 'lucide-react';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { getAvatarSvg } from './avatar/generator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { isAdmin as isUserAdmin, isExactlyModerator as isUserModerator } from '../rbac';
import { roleBadges, roleClasses } from '../rbac/colors';
import { useSidebar } from '@/components/ui/sidebar';
import { AlertDialog } from '@/components/ui/alert-dialog';

export function UserBio({ bio, className }: { bio: string | undefined; className: String }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {bio && (
        <div className='mt-2 grid grid-cols-[max-content_1fr] items-start gap-x-4'>
          <p className='text-md font-semibold'>О себе:</p>
          <div className='max-w-sm text-muted-foreground'>
            <p className={`transition-all ${isExpanded ? 'line-clamp-none' : 'line-clamp-3'}`}>
              {bio}
            </p>
            {bio.split(' ').length > 20 && (
              <button onClick={handleToggle} className={`${className} hover:underline`}>
                {isExpanded ? 'Скрыть' : 'Показать полностью'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function UserView({
  user,
  currentUser = false,
  canEdit = false,
  canDelete = false,
  canManageRoles = false
}: {
  user: UserDto;
  currentUser?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canManageRoles?: boolean;
}) {
  const { isMobile } = useSidebar();

  const userPosts = [
    { id: 1, title: 'My first post', content: 'This is the content of the first post.' },
    { id: 2, title: 'My second post', content: 'This is the content of the second post.' }
  ];

  const isAdmin = isUserAdmin(user);
  const isModerator = isUserModerator(user);

  const handleEdit = () => {
    toast.success('Редактирование пользователя');
    // TODO
  };

  const handleDelete = () => {
    toast.success('Пользователь удален');
    // TODO
  };

  const hoverBg = (user: UserDto) =>
    isAdmin
      ? 'hover:border-destructive hover:bg-destructive/20'
      : isModerator
        ? 'hover:border-primary hover:bg-primary/30'
        : 'hover:border-muted hover:bg-muted/50';

  return (
    <PageContainer>
      <div className='container mx-auto max-w-5xl p-4'>
        <Card className={`relative mb-6 border ${roleClasses(user)}`}>
          <div className='absolute right-4 top-4 flex items-center gap-2'>
            {canEdit && (
              <button
                onClick={handleEdit}
                className={`rounded-full p-2 focus:outline-none focus:ring-2 ${isAdmin ? 'text-destructive ring-destructive/40 hover:bg-destructive/10 hover:bg-opacity-30' : 'text-blue-600 hover:bg-blue-600 hover:bg-opacity-30 focus:ring-blue-300'}`}
              >
                <Edit className='h-5 w-5' />
              </button>
            )}

            {(canDelete || !canEdit) && (
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`rounded-full p-2 focus:outline-none focus:ring-2 ${isAdmin ? 'ring-destructive/40' : 'ring-ring-blue-300'} ${hoverBg(user)}`}
                    >
                      <MoreVertical className='h-5 w-5' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-40'>
                    {canDelete && (
                      <DropdownMenuItem onClick={handleDelete}>
                        <Trash className='mr-2 h-4 w-4 text-red-600' />
                        Удалить
                      </DropdownMenuItem>
                    )}
                    {/* TODO another actions */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </AlertDialog>
            )}
          </div>

          <div className='flex flex-col md:flex-row md:items-stretch'>
            {!isMobile ? (
              <div className='relative mx-auto flex-shrink-0 md:mx-0 md:w-1/3 md:overflow-hidden md:rounded-l-lg'>
                <div className='mt-4 flex h-32 w-32 items-center justify-center rounded-full bg-muted md:mt-0 md:aspect-square md:h-auto md:w-full md:rounded-none'>
                  <Image
                    src={user?.photo ?? getAvatarSvg(user?.username).toDataUri()}
                    alt={`${user.username}'s avatar`}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center text-center'>
                <div className='mt-6 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full bg-muted'>
                  <Image
                    src={user?.photo ?? getAvatarSvg(user?.username).toDataUri()}
                    alt={`${user.username}'s avatar`}
                    width={220}
                    height={220}
                    className='rounded-full object-cover'
                  />
                </div>
              </div>
            )}

            <CardContent
              className={`flex w-full flex-col items-center p-6 md:w-2/3 md:items-start ${isMobile ? '' : 'pl-12'}`}
            >
              <CardTitle className='flex items-center gap-x-2 text-4xl font-bold'>
                {isAdmin && <ShieldAlert className='h-8 w-8 text-destructive' />}
                {isModerator && <UserCheck className='h-8 w-8 text-primary' />}
                {user.username}
              </CardTitle>
              <p className='mt-2 text-lg text-muted-foreground'>
                <a
                  className={`${isAdmin ? 'text-destructive' : 'text-blue-600'} hover:underline dark:${isAdmin ? 'text-destructive' : 'text-blue-500'}`}
                  href={`mailto:${user.email}`}
                >
                  {user.email}
                </a>
              </p>

              <Separator className='my-4' />
              <div className='mt-4'>
                <div className='flex items-center gap-2'>
                  <p className='text-md font-semibold'>Уровни доступа:</p>
                  <div className='flex flex-wrap gap-2'>
                    {user.roles.length > 0 ? (
                      [...user.roles]
                        .sort((a, b) => {
                          const rolePriority: Record<string, number> = {
                            ROLE_USER: 1,
                            ROLE_MODERATOR: 2,
                            ROLE_ADMIN: 3
                          };
                          return (rolePriority[a] || 99) - (rolePriority[b] || 99);
                        })
                        .map((role, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className={`border text-sm ${roleBadges[role]}`}
                          >
                            {role.replace('ROLE_', '').toLowerCase()}
                          </Badge>
                        ))
                    ) : (
                      <p className='text-muted-foreground'>Нет уровней доступа</p>
                    )}
                  </div>
                </div>

                <UserBio
                  bio={user.bio}
                  className={isAdmin ? 'text-destructive' : 'text-blue-600'}
                />
              </div>
            </CardContent>
          </div>
        </Card>

        <Separator className='my-6' />

        <div>
          <h2 className='mb-4 text-2xl font-semibold'>Последние посты</h2>
          <div className='space-y-4'>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <Card key={post.id} className='border'>
                  <CardHeader>
                    <CardTitle className='text-lg font-bold'>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>{post.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className='text-muted-foreground'>No posts available</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
