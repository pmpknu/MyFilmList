'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Role } from '@/interfaces/role/model/UserRole';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/spinner';
import UserRoleService from '@/services/UserRoleService';
import { roleBadges } from '../rbac/colors';
import { X as Delete, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface UserRolesProps {
  userId: number;
  roles: Role[];
  canAddRoles: Role[];
  canDeleteRoles: Role[];
  onRolesUpdate: (updatedRoles: Role[]) => void;
}

function capitalize(s: string) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase();
}

export const UserRoles: React.FC<UserRolesProps> = ({
  userId,
  roles: initialRoles,
  canAddRoles: initialCanAddRoles,
  canDeleteRoles: initialCanDeleteRoles,
  onRolesUpdate
}) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [canAddRoles, setCanAddRoles] = useState<Role[]>(initialCanAddRoles);
  const [canDeleteRoles, setCanDeleteRoles] = useState<Role[]>(initialCanDeleteRoles);

  const [loadingRoles, setLoadingRoles] = useState<Record<Role, boolean>>(
    {} as Record<Role, boolean>
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableRolesToAdd = canAddRoles.filter((role) => !roles.includes(role));

  const sortRoles = (roles: Role[]) => {
    return roles.sort((a, b) => {
      const rolePriority: Record<string, number> = {
        ROLE_USER: 1,
        ROLE_MODERATOR: 2,
        ROLE_ADMIN: 3
      };
      return (rolePriority[a] || 99) - (rolePriority[b] || 99);
    });
  };

  const handleAddRole = async (role: Role) => {
    setLoadingRoles((prev) => ({ ...prev, [role]: true }));
    setRoles((prev) => [...prev, role]);
    setCanAddRoles((prev) => prev.filter((r) => r !== role));
    setCanDeleteRoles((prev) => [...prev, role]);

    try {
      await UserRoleService.addRoleToUser(userId, { role });
      toast.success(`Роль ${capitalize(role.replace('ROLE_', ''))} добавлена`, {
        description: 'Вы успешно изменили права доступа пользователя.'
      });
    } catch (error) {
      console.error(error);
      toast.error('Ошибка добавления роли', {
        description: 'Попробуйте повторить позднее'
      });
      setRoles((prev) => prev.filter((r) => r !== role));
      setCanAddRoles((prev) => [...prev, role]);
      setCanDeleteRoles((prev) => prev.filter((r) => r !== role));
    } finally {
      setLoadingRoles((prev) => ({ ...prev, [role]: false }));
    }
  };

  const handleRemoveRole = async (role: Role) => {
    setLoadingRoles((prev) => ({ ...prev, [role]: true }));

    try {
      await UserRoleService.removeRoleFromUser(userId, { role });
      toast.success(`Роль ${capitalize(role.replace('ROLE_', ''))} удалена`, {
        description: 'Вы успешно изменили права доступа пользователя.'
      });
      const updatedRoles = roles.filter((r) => r !== role);
      setRoles(updatedRoles);
      setCanAddRoles((prev) => [...prev, role]);
      setCanDeleteRoles((prev) => prev.filter((r) => r !== role));
      onRolesUpdate(updatedRoles);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка удаления роли', {
        description: 'Попробуйте повторить позднее'
      });
    } finally {
      setLoadingRoles((prev) => ({ ...prev, [role]: false }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  const sortedRoles = sortRoles([...roles]);

  return (
    <div>
      <div className='flex items-center gap-2'>
        <p className='text-md font-semibold'>Уровни доступа:</p>
        <div className='flex flex-wrap gap-2'>
          {sortedRoles.length > 0 ? (
            sortedRoles.map((role, index) => (
              <Badge
                key={index}
                variant='secondary'
                className={`relative flex items-center gap-2 border text-sm ${roleBadges[role]} ${
                  !loadingRoles[role] && canDeleteRoles.includes(role)
                    ? 'group hover:bg-red-500 hover:text-white'
                    : ''
                }`}
                onClick={() =>
                  !loadingRoles[role] && canDeleteRoles.includes(role) && handleRemoveRole(role)
                }
              >
                {loadingRoles[role] ? (
                  <LoadingSpinner className='h-4 w-4' />
                ) : (
                  <span className='relative capitalize'>
                    <span
                      className={`transition-colors transition-opacity ${canDeleteRoles.includes(role) ? 'opacity-100 group-hover:opacity-0' : ''}`}
                    >
                      {role.replace('ROLE_', '').toLowerCase()}
                    </span>
                    {canDeleteRoles.includes(role) && (
                      <span className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100'>
                        <Delete className='h-4 w-4' />
                      </span>
                    )}
                  </span>
                )}
              </Badge>
            ))
          ) : (
            <p className='text-muted-foreground'>Нет уровней доступа</p>
          )}
          {availableRolesToAdd.length > 0 && (
            <div className='relative' ref={dropdownRef}>
              <Badge
                variant='secondary'
                className='flex items-center gap-2 border text-sm hover:bg-green-500 hover:text-white'
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <Plus className='h-4 w-4' />
              </Badge>
              {isDropdownOpen && (
                <div className='absolute left-0 z-10 mt-2 w-40 rounded-md border bg-white p-2 shadow-md dark:bg-gray-800'>
                  {sortRoles(availableRolesToAdd).map((role) => (
                    <div key={role}>
                      {role !== sortRoles(availableRolesToAdd)[0] && <Separator className='py-1' />}
                      <Badge
                        key={role}
                        variant='secondary'
                        className={`relative flex cursor-pointer items-center gap-2 border text-sm ${roleBadges[role]} hover:bg-blue-500 hover:text-white`}
                        onClick={() => {
                          handleAddRole(role);
                          // setIsDropdownOpen(false);
                        }}
                      >
                        {loadingRoles[role] ? (
                          <LoadingSpinner className='h-4 w-4' />
                        ) : (
                          <span className='capitalize'>
                            {role.replace('ROLE_', '').toLowerCase()}
                          </span>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
