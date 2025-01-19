'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ShieldAlert, UserCheck } from 'lucide-react';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { getAvatarSvg } from './avatar/generator';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { isAdmin as isUserAdmin, isExactlyModerator as isUserModerator } from '../rbac';
import { roleBadges, roleClasses } from '../rbac/colors';

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
  const userPosts = [
    { id: 1, title: 'My first post', content: 'This is the content of the first post.' },
    { id: 2, title: 'My second post', content: 'This is the content of the second post.' }
  ];

  const isAdmin = isUserAdmin(user);
  const isModerator = isUserModerator(user);

  return (
    <PageContainer>
      <div className='container mx-auto max-w-5xl p-4'>
        <Card className={`mb-6 border ${roleClasses(user)}`}>
          <div className='flex flex-col md:flex-row md:items-stretch'>
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

            <CardContent className='flex w-full flex-col items-center p-6 pl-12 md:w-2/3 md:items-start'>
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
