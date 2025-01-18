'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { UserDto } from '@/interfaces/user/dto/UserDto';
import { getAvatarSvg } from './avatar/generator';

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
  return (
    <div className='flex items-center rounded-lg bg-white p-6 shadow-md'>
      <div className='flex-shrink-0'>
        {user?.photo ? (
          <Image
            src={user?.photo}
            alt={`${user?.username}'s photo`}
            width={100}
            height={100}
            className='rounded-full'
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: getAvatarSvg(user?.username).toString() }}></div>
        )}
      </div>
      <div className='ml-4'>
        <h2 className='text-xl font-bold'>{user?.username}</h2>
        <p className='text-gray-600'>{user?.email}</p>
      </div>
    </div>
  );
}
