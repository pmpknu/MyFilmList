import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';

export const getAvatarSvg = (username: string, size: number = 80) => {
  const avatar = createAvatar(thumbs, {
    seed: username,
    size,
    backgroundType: ['gradientLinear']
  });
  return avatar;
};
