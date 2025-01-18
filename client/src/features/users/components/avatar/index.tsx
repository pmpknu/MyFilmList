import React from 'react';
import Image from 'next/image';

import { UserDto } from '@/interfaces/user/dto/UserDto';
import { getAvatarSvg } from './generator';

export default function UserAvatar({
  user,
  layout,
  className,
  height = 96,
  width = 96
}: {
  user: UserDto;
  layout?: string;
  className?: string;
  height?: number;
  width?: number;
}) {
  return user?.photo ? (
    <Image
      src={user?.photo}
      alt={`${user?.username}'s photo`}
      layout={layout}
      width={height}
      height={width}
      className={className}
    />
  ) : (
    <svg
      width={height}
      height={width}
      className={className}
      dangerouslySetInnerHTML={{ __html: getAvatarSvg(user?.username, height).toString() }}
    />
  );
}
