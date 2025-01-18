'use client';

import { useDispatch, useSelector } from 'react-redux';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import AuthService from '@/services/AuthService';
import { RootState } from '@/store';
import { logout } from '@/store/slices/auth-slice';
import SignOutDialog from '@/features/auth/components/sign-out-dialog';
import { toast } from 'sonner';

export function UserNav() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleSubmit = async (onAllDevices: boolean) => {
    await AuthService.signOut(onAllDevices);
    AuthService.forgetAuth();
    dispatch(logout());
    toast.success('Вы успешно вышли из аккаунта!');
  };

  if (isAuthenticated) {
    return (
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8 rounded-full'>
                <AvatarImage src={user?.photo || ''} alt={user?.username} />
                <AvatarFallback className='rounded-full'>
                  {user?.username.slice(0, 2)?.toUpperCase() || 'JD'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{user?.username}</p>
                <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>New Team</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <SignOutDialog user={user!} handleSubmit={handleSubmit} />
      </AlertDialog>
    );
  }
}
