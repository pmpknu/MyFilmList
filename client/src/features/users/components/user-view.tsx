'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  MoreVertical,
  Edit,
  ShieldAlert,
  Trash,
  UserCheck,
  Share,
  ClipboardCopy,
  XCircle
} from 'lucide-react';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { getAvatarSvg } from './avatar/generator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
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
import { hoverBg, roleBadges, roleClasses } from '../rbac/colors';
import { useSidebar } from '@/components/ui/sidebar';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DeleteUserDialog from './delete-user-dialog';
import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
import MovieViewService from '@/services/MovieViewService';
import RatingService from '@/services/RatingService';
import WatchListService from '@/services/WatchListService';
import { logout } from '@/store/slices/auth-slice';
import { useDispatch } from '@/hooks/use-redux';
import { useTheme } from 'next-themes';
import { Role } from '@/interfaces/role/model/UserRole';
import { MovieViewWithoutUserDto } from '@/interfaces/movieview/dto/MovieViewWithoutUserDto';
import { RatingWithoutUserDto } from '@/interfaces/rating/dto/RatingWithoutUserDto';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';
import { UserRoles } from './user-roles';

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
  canAddRoles = [],
  canDeleteRoles = []
}: {
  user: UserDto;
  currentUser?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canAddRoles?: Role[];
  canDeleteRoles?: Role[];
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [isAdmin, setIsAdmin] = useState(isUserAdmin(user));
  const [isModerator, setIsModerator] = useState(isUserModerator(user));

  const [copySuccess, setCopySuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<Role[]>(user.roles);

  const [views, setViews] = useState<MovieViewWithoutUserDto[] | null>(null);
  const [loadingViews, setLoadingViews] = useState(false);

  const [ratings, setRatings] = useState<RatingWithoutUserDto[] | null>(null);
  const [loadingRatings, setLoadingRatings] = useState(false);

  const [watchLists, setWatchLists] = useState<WatchListDto[] | null>(null);
  const [loadingWatchLists, setLoadingWatchLists] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    setIsAdmin(() => isUserAdmin({ ...user, roles: userRoles }));
    setIsModerator(() => isUserModerator({ ...user, roles: userRoles }));
  }, [userRoles]);

  const handleRolesUpdate = (updatedRoles: Role[]) => {
    setUserRoles(updatedRoles);
  };

  const fetchWatchLists = async () => {
    if (!hasMore) return;

    setLoadingWatchLists(true);
    try {
      const response = await WatchListService.getWatchListsForUser(user.id, page, pageSize, [
        'name,asc'
      ]);
      setWatchLists((prev) =>
        prev ? [...prev, ...response.data.content] : [...response.data.content]
      );
      setHasMore(!response.data.last);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка загрузки списков фильмов', {
        description: 'Не удалось загрузить списки. Попробуйте позднее.'
      });
    } finally {
      setLoadingWatchLists(false);
    }
  };

  useEffect(() => {
    const fetchViews = async () => {
      setLoadingViews(true);
      try {
        const response = await MovieViewService.getViewsForUser(user.id, 0, 10, ['watchDate,desc']);
        setViews(response.data.content);
      } catch (error) {
        console.error(error);
        toast.error('Ошибка загрузки просмотров', {
          description: 'Не удалось загрузить просмотры. Попробуйте позднее.'
        });
      } finally {
        setLoadingViews(false);
      }
    };

    const fetchRatings = async () => {
      setLoadingRatings(true);
      try {
        const response = await RatingService.getRatingsByUser(user.id, 0, 10, ['value,desc']);
        setRatings(response.data.content);
      } catch (error) {
        console.error(error);
        toast.error('Ошибка загрузки рейтингов', {
          description: 'Не удалось загрузить рейтинги. Попробуйте позднее.'
        });
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchViews();
    fetchRatings();
    fetchWatchLists();
  }, []);

  const handleEdit = () => {
    toast.success('Редактирование пользователя');
    // TODO
  };

  const handleDelete = () => {
    UserService.deleteUser(user.id)
      .then(() => {
        router.push('/');
        if (currentUser) {
          toast.info('Вы успешно удалили вашу учётную запись!', {
            description: 'Будем рады увидеть вас снова!',
            duration: 3500
          });
          setTimeout(async () => {
            AuthService.forgetAuth();
            dispatch(logout());
          }, 1000);
        } else {
          toast.success('Вы успешно удалили учётную запись!');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Во время удаления учётной записи произошла ошибка', {
          description: 'Извините, что-то пошло не так. Попробуйте повторить позднее'
        });
      });
  };

  const handleDeactivateAccount = () => {
    toast.success('Аккаунт успешно отключен.');
    // TODO
  };

  const usersUrl = `${window.location.origin}/users/${user.id}`;

  const handleShare = async (e: React.UIEvent<HTMLDivElement>) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Пользователь @${user.username}`,
          text: `Посмотрите профиль @${user.username} на MyFilmList!`,
          url: usersUrl
        });
      } catch (error) {
        console.error('Web Share API error: ', error);
        toast.error('Ошибка при использовании Web Share API');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = (e?: React.UIEvent<HTMLDivElement>) => {
    e?.preventDefault();
    toast.info('Ссылка скопирована в буфер обмена', {
      description: 'Теперь вы можете вставить её в любом месте, где это необходимо.',
      duration: 1500
    });
    navigator.clipboard.writeText(usersUrl).then(() => {
      setCopySuccess(true);
      if (!copySuccess) {
        setTimeout(() => setCopySuccess(false), 2000);
      }
    });
  };

  return (
    <PageContainer>
      <div className='container mx-auto max-w-5xl p-4'>
        <Card className={`relative mb-6 border ${roleClasses({ ...user, roles: userRoles })}`}>
          <div className='absolute right-4 top-4 flex items-center gap-2'>
            {!isMobile && canEdit && (
              <button
                onClick={handleEdit}
                className={`rounded-full p-2 focus:outline-none focus:ring-2 ${isAdmin ? 'text-destructive ring-destructive/40 hover:bg-destructive/10 hover:bg-opacity-30' : 'text-blue-600 hover:bg-blue-600 hover:bg-opacity-30 focus:ring-blue-300'}`}
              >
                <Edit className='h-5 w-5' />
              </button>
            )}
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`rounded-full p-2 focus:outline-none focus:ring-2 ${isAdmin ? 'ring-destructive/40' : 'ring-blue-300'} ${hoverBg({ ...user, roles: userRoles })}`}
                  >
                    <MoreVertical className='h-5 w-5' />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-40'>
                  {isMobile && canEdit && (
                    <>
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className='mr-2 h-4 w-4 text-blue-600' />
                        Изменить
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {!currentUser && canDeleteRoles.includes(Role.ROLE_USER) && (
                    <>
                      <DropdownMenuItem onClick={handleDeactivateAccount}>
                        <XCircle className='mr-2 h-4 w-4 text-red-400' />
                        Деактивировать
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {'share' in navigator && (
                    <>
                      <DropdownMenuItem onClick={handleShare}>
                        <Share className='mr-2 h-4 w-4' />
                        Поделиться
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem onClick={handleCopyLink}>
                    <ClipboardCopy className='mr-2 h-4 w-4' />
                    {copySuccess ? 'Cкопировано!' : 'Скопировать'}
                  </DropdownMenuItem>

                  {canDelete && (
                    <div onClick={() => setIsDialogOpen(true)}>
                      <DropdownMenuSeparator />
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem>
                          <Trash className='mr-2 h-4 w-4 text-red-600' />
                          Удалить
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DeleteUserDialog
                isOpen={isDialogOpen}
                setOpen={setIsDialogOpen}
                user={user}
                currentUser={currentUser}
                handleSubmit={handleDelete}
              />
            </AlertDialog>
          </div>

          <div className='flex flex-col md:flex-row md:items-stretch'>
            {!isMobile ? (
              <div className='relative mx-auto flex-shrink-0 md:mx-0 md:w-1/3 md:overflow-hidden md:rounded-l-lg'>
                <div className='mt-4 flex h-32 w-32 items-center justify-center rounded-full bg-muted md:mt-0 md:aspect-square md:h-auto md:w-full md:rounded-none'>
                  <Image
                    src={user?.photo ?? getAvatarSvg(user?.username, theme).toDataUri()}
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
                    src={user?.photo ?? getAvatarSvg(user?.username, theme).toDataUri()}
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
              <UserRoles
                user={{ ...user, roles: userRoles }}
                roles={userRoles}
                canAddRoles={canAddRoles}
                canDeleteRoles={canDeleteRoles}
                onRolesUpdate={handleRolesUpdate}
              />

              <UserBio bio={user.bio} className={isAdmin ? 'text-destructive' : 'text-blue-600'} />
            </CardContent>
          </div>
        </Card>

        <Separator className='my-6' />

        <div>
          <h2 className='mb-4 text-2xl font-semibold'>Списки фильмов</h2>
          {watchLists && watchLists.length > 0 ? (
            <div className='space-y-4'>
              {watchLists.map((watchList) => (
                <Card key={watchList.id} className='border'>
                  <CardHeader className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <CardTitle className='text-lg font-bold'>
                        <a href={`/watchlists/${watchList.id}`} className='hover:underline'>
                          {watchList.name}
                        </a>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground'>
                        {watchList.visibility ? 'Публичный' : 'Приватный'}
                      </p>
                    </div>
                    {watchList.photo ? (
                      <Image
                        src={watchList.photo}
                        alt={watchList.name}
                        width={64}
                        height={64}
                        className='rounded'
                      />
                    ) : (
                      <div className='flex h-16 w-16 items-center justify-center rounded bg-muted'>
                        <span className='text-muted-foreground'>Нет фото</span>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>Списки фильмов не найдены</p>
          )}
          {hasMore && (
            <div className='mt-4 flex justify-center'>
              <button
                className='hover:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white'
                onClick={fetchWatchLists}
                disabled={loadingWatchLists}
              >
                {loadingWatchLists ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}
        </div>

        <Separator className='my-6' />
        <div>
          <h2 className='mb-4 text-2xl font-semibold'>Просмотры</h2>
          {loadingViews ? (
            <p>Загрузка просмотров...</p>
          ) : views && views.length > 0 ? (
            <div className='grid gap-4'>
              {views.map((view) => (
                <Card key={view.id} className='border'>
                  <CardHeader>
                    <CardTitle className='text-lg font-bold'>{view.movie.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      Дата просмотра: {new Date(view.watchDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>Просмотры не найдены</p>
          )}
        </div>

        <Separator className='my-6' />
        <div>
          <h2 className='mb-4 text-2xl font-semibold'>Рейтинги</h2>
          {loadingRatings ? (
            <p>Загрузка рейтингов...</p>
          ) : ratings && ratings.length > 0 ? (
            <div className='grid gap-4'>
              {ratings.map((rating) => (
                <Card key={rating.id} className='border'>
                  <CardHeader>
                    <CardTitle className='text-lg font-bold'>{rating.movie.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>Оценка: {rating.value}/10</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground'>Рейтинги не найдены</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
