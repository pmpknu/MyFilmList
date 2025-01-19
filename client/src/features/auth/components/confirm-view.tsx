'use client';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import AuthService from '@/services/AuthService';
import { useDispatch } from '@/hooks/use-redux';
import { login } from '@/store/slices/auth-slice';
import PageContainer from '@/components/layout/page-container';

const progressStates = {
  5: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⡀⡀⠉⠉⠉⠉⡋⢉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⡋⠉⠉⠉⠉⡋⢉⠉⡀⠈⠉⠉⠉⠉⡋⢉⠉⢉⣁⣤⣿⣿`,
  10: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⢷⠾⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⠦⣙⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡙⢦⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠀⡀⡀⠉⠉⠉⠉⡋⢉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⡋⠉⠉⠉⠉⡋⢉⠉⡀⠈⠉⠉⠉⠉⡋⢉⠉⢉⣁⣤⣿⣿`,
  20: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⣛⠾⣞⡳⢷⠾⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⣉⢆⠳⣒⠦⣙⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡍⢦⢋⡴⡙⢦⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠁⠉⠀⠉⠀⡀⠈⠈⠁⠁⠈⠁⠉⠈⠀⠉⠀⠉⠁⠈⠁⠈⠈⠁⠈⠉⠉⠁⠈⠉⠉⠉⠉⡋⢉⠉⢉⣁⣤⣿⣿`,
  30: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⣛⠾⣞⡳⠷⣛⢾⢳⣞⡳⢷⠾⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⣉⢆⠳⣒⠼⡑⡎⡖⠦⣙⠦⣙⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡍⢦⢋⡴⠳⣡⠏⡼⡺⢔⡙⢦⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠁⠉⠀⠉⠈⠈⠁⠈⠁⠁⠈⠀⡀⠈⠈⠀⠉⠀⠉⠁⠈⠁⠈⠈⠁⠈⠉⠉⠁⠉⠉⠉⠉⡋⢉⠉⢉⣁⣤⣿⣿`,
  50: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⣛⢾⢳⣛⢾⢳⡞⢷⠾⣞⡳⠷⣛⢾⢳⣞⡳⢷⠾⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⣉⢦⢓⡬⣒⢣⡜⢣⢆⠳⣒⠼⡑⡎⡖⠦⣙⠦⣙⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡍⢦⢋⡴⠳⣡⠏⡼⢡⠞⣌⠧⡹⠴⡙⡺⢔⡙⢦⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠁⠉⠀⠉⠈⠈⠁⠈⠁⠁⠈⠁⠉⠈⠀⠉⠀⠉⡀⠈⠁⠁⠈⠈⠁⠈⠉⠈⠈⠉⠉⠉⠉⡋⢉⠉⢉⣁⣤⣿⣿`,
  60: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⣛⢾⢳⣛⢾⢳⡞⢷⣳⢻⢶⣛⠾⣞⡳⣞⠷⣛⢾⢳⣞⡳⢷⠾⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⣉⢦⢓⡬⣒⢣⡜⢣⢆⠳⣒⠬⡓⢦⡱⢎⠼⡑⡎⡖⠦⣙⠦⣙⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡍⢦⢋⡴⢃⠧⡜⢣⢎⠳⣡⠏⡼⢡⠞⣌⠧⡹⠴⡙⡺⢔⡙⢦⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠁⠉⠀⠉⠈⠈⠁⠈⠁⠁⠈⠁⠉⠈⠀⠉⠀⠉⠁⠈⠁⠈⠈⠀⡀⠈⠉⠉⠉⠉⠉⠉⠉⡋⢉⠉⢉⣁⣤⣿⣿`,
  70: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⣛⢾⢳⣛⢾⢳⡞⢷⣳⢻⢶⣛⠾⣞⡳⣞⠷⣛⢾⢳⡻⢶⣛⠾⣞⡳⢷⠾⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⣉⢦⢓⡬⣒⢣⡜⢣⢆⠳⣒⠬⡓⢦⡱⢎⠼⡑⡎⡖⣡⠳⣌⢓⠦⣙⠦⣙⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡍⢦⢋⡴⢃⠧⡜⢣⢎⠳⣡⠏⡼⢡⠞⣌⠧⡹⠴⡙⡴⢓⡬⢍⡺⢔⡙⢦⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠁⠉⠀⠉⠈⠈⠁⠈⠁⠁⠈⠁⠉⠈⠀⠉⠀⠉⠁⠈⠁⠈⠈⠁⠈⠉⠀⡀⠈⠉⠉⠉⠉⡋⢉⠉⢉⣁⣤⣿⣿`,
  85: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⣛⢾⢳⣛⢾⢳⡞⢷⣳⢻⢶⣛⠾⣞⡳⢓⡬⣒⢣⣞⠷⣛⢾⢳⡻⢶⣛⠾⣞⡳⢷⠾⠀⢸⣿⣿⣿⣿⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⣉⢦⢓⡬⣒⢣⡜⢣⢆⠳⣒⠬⡓⡜⢣⢆⠳⣒⡱⢎⠼⡑⡎⡖⣡⠳⣌⢓⠦⣙⠦⣙⠀⢸⣿⣿⣿⣿⣿⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡍⢦⢋⡴⢃⠧⡜⢣⢎⠳⣡⠏⡼⢡⠞⣌⠧⡹⠴⢎⠼⡑⡎⡙⡴⢓⡬⢍⡺⢔⡙⢦⠀⢸⣿⣿⣿⣿⣿⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠁⠉⠀⠉⠈⠈⠁⠈⠁⠁⠈⠁⠉⠈⠀⠉⠀⠉⠁⠈⠁⠈⠈⠁⠈⠈⠁⠈⠈⠉⠉⡀⠈⡋⢉⠉⢉⣁⣤⣿⣿`,
  100: `
⣿⣿⡿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⡛⠛⠛⢿⣿⣿
⣿⡟⠀⣴⣞⡷⣛⢾⢳⣛⢾⢳⡞⢷⣳⢻⢶⣛⠾⣞⡳⢓⡬⣒⢣⣞⠷⣛⢾⢳⡻⢶⣛⠾⣞⡳⢣⠳⠳⣞⠷⣛⢷⠾⣷⠀⢻⣿
⣿⡇⠀⣷⡫⠴⣉⢦⢓⡬⣒⢣⡜⢣⢆⠳⣒⠬⡓⡜⢣⢆⠳⣒⡱⢎⠼⡑⡎⡖⣡⠳⣌⢓⠦⣙⠳⠳⠦⣙⡎⡙⡴⢓⡬⡃⢸⣿
⣿⣇⠀⢷⡏⡱⡍⢦⢋⡴⢃⠧⡜⢣⢎⠳⣡⠏⡼⢡⠞⣌⠧⡹⠴⢎⠼⡑⡎⡙⡴⠏⡼⢡⣒⡱⠞⢓⡬⢍⡺⢔⡙⡼⠁⠁⢸⣿
⣿⣿⣤⣈⠁⠁⠈⠁⠉⠀⠉⠈⠈⠁⠈⠁⠁⠈⠁⠉⠈⠀⠉⠀⠉⠁⠀⠉⠈⠈⠁⠈⠁⠁⠈⠁⠉⠈⠀⠉⡋⢉⠉⢉⣁⣤⣿⣿`
};

export default function ConfirmViewPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const token = searchParams.get('confirmation_token');

  const [dots, setDots] = useState('.');
  const [progress, setProgress] = useState(5);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<string>(progressStates[5]);

  const [confirmedSuccessfully, setConfirmedSuccessfully] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      toast.error('Ошибка подтверждения.', { description: 'Токен не обнаружен.' });
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }

    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);

    const confirmAccount = () => {
      if (!token) {
        setConfirmedSuccessfully(false);
        setLoading(false);
        clearInterval(interval);
        return;
      }

      setProgress(5);

      AuthService.confirmEmail(token as string)
        .then(async (response) => {
          for (const [key, value] of Object.entries(progressStates)) {
            setProgress(parseInt(key, 10));
            setCurrentStatus(value);
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          setConfirmedSuccessfully(true);

          AuthService.setAuth(response.data);
          dispatch(login(response.data));

          setTimeout(() => {
            router.push('/');
          }, 3000);
        })
        .catch((error) => {
          setConfirmedSuccessfully(false);
          setLoading(false);
          clearInterval(interval);

          const axiosError = error as AxiosError;
          if (axiosError.response) {
            toast.error('Токен подтверждения истёк или не найден.', {
              description: 'Попробуйте подтвердить аккаунт еще раз.'
            });
          } else {
            toast.error('Ошибка подтверждения.');
          }
        });
    };

    confirmAccount();
    return () => clearInterval(interval);
  }, [token]);

  return (
    <PageContainer>
      <div className='mx-auto flex w-full max-w-lg flex-col justify-center'>
        <div className='flex w-full flex-col items-center justify-center py-20'>
          {confirmedSuccessfully == null && (
            <div className='text-center'>
              <div className='bg-gradient-to-b from-foreground to-transparent bg-clip-text text-xs font-extrabold text-transparent max-[600px]:text-[0.5rem] max-[600px]:leading-[0.6rem]'>
                {`
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠉⠉⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡅⠰⡁⢨⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠉⠙⠻⣿⣿⣿⡆⠠⠁⢠⣿⣿⣿⠟⠋⠉⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠙⠿⣦⡄⠙⣿⣷⣶⣶⣾⣿⠋⢀⠤⠒⠁⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣀⣀⣠⣿⣿⣿⣿⣿⣿⣄⣀⣀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⢁⣠⡄⠈⣿⣿⣿⣿⣿⣿⠁⠠⣀⠈⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠺⠛⢉⣠⣴⣿⡟⠉⠉⢻⣿⣦⣄⡀⠉⠂⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣾⣿⣿⣿⣿⡃⠠⠃⢈⣿⣿⣿⣿⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡅⠐⠃⢨⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
${currentStatus}
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠉⣿⣿⣿⣿⠟⠉⣉⠉⠻⣿⣿⡟⠉⠙⣿⣿⣿⠉⢉⡉⠙⢿⣿⠉⢻⡏⠙⢿⣿⣿⠉⢹⣿⠟⠋⢉⠉⠙⢿⣿⣿⣿⣿⣿
⣿⣿⣿⠀⣿⣿⣿⡏⠀⣿⣿⣿⡀⢹⣿⠀⣸⡀⢸⣿⣿⠀⣿⣿⣇⠈⣿⠀⢸⡇⢀⡈⠻⣿⠀⢸⡏⢀⣾⣿⣿⣷⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠀⣿⣿⣿⡇⠐⣿⣿⣿⠀⢸⡇⠀⠛⠓⠀⢿⣿⠀⣿⣿⡇⠀⣿⠀⢸⡇⠸⣷⣄⠙⠀⢸⡇⠈⣿⣧⣤⡄⠀⣽⣿⣿⣿⣿
⣿⣿⣿⠀⠉⠉⠉⣻⣄⣈⠉⢁⣠⣿⢀⣶⣾⣶⣆⢘⣯⠀⠉⠉⣀⣼⣿⡀⣸⡇⢈⣿⣿⣦⡀⣸⣿⣦⣈⠉⢉⣀⣼⣿⣿⣿⣿⣿
`}
              </div>
              <h1 className='mb-4 text-xl font-bold'>
                Выполняется подтверждение страницы{dots}
                {'\u00A0'.repeat(3 - (dots.split('.').length - 1))}
              </h1>
            </div>
          )}
          {confirmedSuccessfully != null && confirmedSuccessfully && (
            <>
              <pre className='bg-gradient-to-b from-foreground to-transparent bg-clip-text text-xs font-extrabold text-transparent max-[600px]:text-[0.5rem] max-[600px]:leading-[0.6rem]'>
                {`
.d88888b  dP     dP  a88888b.  a88888b.  88888888b .d88888b  .d88888b
88.    "' 88     88 d8'   \`88 d8'   \`88  88        88.    "' 88.    "'
\`Y88888b. 88     88 88        88         88aaaa    \`Y88888b. \`Y88888b.
      \`8b 88     88 88        88         88              \`8b       \`8b
d8'   .8P Y8.   .8P Y8.   .88 Y8.   .88  88        d8'   .8P d8'   .8P
 Y88888P  \`Y88888P'  Y88888P'  Y88888P'  88888888P  Y88888P   Y88888P

.d88888b  dP     dP  a88888b.  a88888b.  88888888b .d88888b  .d88888b
88.    "' 88     88 d8'   \`88 d8'   \`88  88        88.    "' 88.    "'
\`Y88888b. 88     88 88        88         88aaaa    \`Y88888b. \`Y88888b.
      \`8b 88     88 88        88         88              \`8b       \`8b
d8'   .8P Y8.   .8P Y8.   .88 Y8.   .88  88        d8'   .8P d8'   .8P
 Y88888P  \`Y88888P'  Y88888P'  Y88888P'  88888888P  Y88888P   Y88888P

.d88888b  dP     dP  a88888b.  a88888b.  88888888b .d88888b  .d88888b
88.    "' 88     88 d8'   \`88 d8'   \`88  88        88.    "' 88.    "'
\`Y88888b. 88     88 88        88         88aaaa    \`Y88888b. \`Y88888b.
      \`8b 88     88 88        88         88              \`8b       \`8b
d8'   .8P Y8.   .8P Y8.   .88 Y8.   .88  88        d8'   .8P d8'   .8P
`}
              </pre>
              <h1 className='mb-4 text-xl font-bold'>
                Учётная запись успешно подтверждена!
                <br />
                Перенаправляем вас на главную страницу...
              </h1>
            </>
          )}
          {confirmedSuccessfully != null && !confirmedSuccessfully && (
            <div className='text-center'>
              <div className='bg-gradient-to-b from-foreground to-transparent bg-clip-text font-extrabold text-transparent max-[600px]:text-[0.7rem] max-[600px]:leading-[0.9rem]'>
                {`
⡴⠒⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠉⠳⡆⠀
⣇⠰⠉⢙⡄⠀⠀⣴⠖⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠁⠙⡆
⠘⡇⢠⠞⠉⠙⣾⠃⢀⡼⠀⠀⠀⠀⠀⠀⠀⢀⣼⡀⠄⢷⣄⣀⠀⠀⠀⠀⠀⠀⠀⠰⠒⠲⡄⠀⣏⣆⣀⡍
⠀⢠⡏⠀⡤⠒⠃⠀⡜⠀⠀⠀⠀⠀⢀⣴⠾⠛⡁⠀⠀⢀⣈⡉⠙⠳⣤⡀⠀⠀⠀⠘⣆⠀⣇⡼⢋⠀⠀⢱
⠀⠘⣇⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⡴⢋⡣⠊⡩⠋⠀⠀⠀⠣⡉⠲⣄⠀⠙⢆⠀⠀⠀⣸⠀⢉⠀⢀⠿⠀⢸
⠀⠀⠸⡄⠀⠈⢳⣄⡇⠀⠀⢀⡞⠀⠈⠀⢀⣴⣾⣿⣿⣿⣿⣦⡀⠀⠀⠀⠈⢧⠀⠀⢳⣰⠁⠀⠀⠀⣠⠃
⠀⠀⠀⠘⢄⣀⣸⠃⠀⠀⠀⡸⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠈⣇⠀⠀⠙⢄⣀⠤⠚⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⢘⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⢰⣿⣿⣿⡿⠛⠁⠀⠉⠛⢿⣿⣿⣿⣧⠀⠀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡀⣸⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⡀⢀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⠹⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡿⠁⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣤⣞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢢⣀⣠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⠲⢤⣀⣀⠀⢀⣀⣀⠤⠒⠉⠀⠀⠀⠀
                `}
              </div>
              <h1 className='mb-4 text-xl font-bold'>
                Ошибка подтверждения.<br/>{token ? 'Попробуйте еще раз.' : 'Неверная ссылка.'}
              </h1>
            </div>
          )}
          {loading && <Progress value={progress} className='w-full max-w-md' />}
        </div>
      </div>
    </PageContainer>
  );
}
