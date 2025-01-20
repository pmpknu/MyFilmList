import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';

const lightOptions = {
  backgroundColor: [
    '#F9FAFB',
    '#F3F4F6',
    '#E5E7EB',
    '#D1D5DB',
    '#D1E7DA',
    '#9CECC4',
    '#EFF6FF',
    '#FFF7ED',
    '#DDD7BF',
    '#FAF5FF',
    '#bccee7',
    '#9df1e6'
  ],
  baseColor: [
    '#38BDF8',
    '#60A5FA',
    '#3B82F6',
    '#2563EB',
    '#0EA5E9',
    '#06B6D4',
    '#2DD4BF',
    '#1E40AF',
    '#1D4ED8',
    '#1E3A8A',
    '#0284C7',
    '#0369A1',
    '#3B82F6',
    '#2563EB',
    '#A78BFA',
    '#8B5CF6',
    '#7C3AED',
    '#6D28D9',
    '#C084FC',
    '#D946EF',
    '#60A5FA',
    '#EC4899',
    '#F43F5E',
    '#DB2777',
    '#E11D48',
    '#FF007F',
    '#FF00FF',
    '#f88c49',
    '#D946EF',
    '#E879F9',
    '#F472B6',
    '#F9A8D4',
    '#0a5b83',
    '#1c799f',
    '#69d2e7'
  ],
  eyesColor: ['#F9FAFB', '#E5E7EB', '#F3F4F6'],
  mouthColor: ['#F9FAFB', '#E5E7EB', '#F3F4F6']
};

const darkOptions = {
  backgroundColor: [
    '#1E293B',
    '#334155',
    '#4B5563',
    '#273344',
    '#102138',
    '#0F172A',
    '#2C2F33',
    '#23272A',
    '#1A202C',
    '#2D3748',
    '#1F2937',
    '#374151',
    '#141f2e',
    '#0e0638',
    '#064149',
    '#33031b',
    '#080d2b',
    '#0b2950',
    '#172a4d',
    '#202141',
    '#2b16a3'
  ],
  baseColor: [
    '#38BDF8',
    '#60A5FA',
    '#3B82F6',
    '#2563EB',
    '#0EA5E9',
    '#06B6D4',
    '#2DD4BF',
    '#1E40AF',
    '#1D4ED8',
    '#1E3A8A',
    '#0284C7',
    '#0369A1',
    '#3B82F6',
    '#2563EB',
    '#A78BFA',
    '#8B5CF6',
    '#7C3AED',
    '#6D28D9',
    '#C084FC',
    '#D946EF',
    '#60A5FA',
    '#EC4899',
    '#F43F5E',
    '#DB2777',
    '#E11D48',
    '#FF007F',
    '#FF00FF',
    '#f88c49',
    '#D946EF',
    '#E879F9',
    '#F472B6',
    '#F9A8D4',
    '#0a5b83',
    '#1c799f',
    '#69d2e7'
  ],
  eyesColor: ['#F9FAFB', '#E5E7EB', '#F3F4F6'],
  mouthColor: ['#F9FAFB', '#E5E7EB', '#F3F4F6']
};

const getOptions = (theme: string | undefined) => (theme === 'dark' ? darkOptions : lightOptions);

export const getAvatarSvg = (
  username: string,
  theme: string | undefined = 'light',
  size: number = 80
) => {
  const options = getOptions(theme);
  const toValue = (colors: string[]) => colors.map((c) => c.substring(1));
  const avatar = createAvatar(thumbs, {
    seed: username,
    backgroundColor: toValue(options.backgroundColor),
    shapeColor: toValue(options.baseColor),
    eyesColor: toValue(options.eyesColor),
    mouthColor: toValue(options.mouthColor),
    backgroundType: ['gradientLinear'],
    size
  });
  return avatar;
};
