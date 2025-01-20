'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Role } from '@/interfaces/role/model/UserRole';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/spinner';
import UserRoleService from '@/services/UserRoleService';
import { roleBadges } from '../rbac/colors';
import { X as Delete } from 'lucide-react';

interface UserRolesProps {
  userId: number;
  roles: Role[];
  canDeleteRoles: Role[];
  onRolesUpdate: (updatedRoles: Role[]) => void;
}

export const UserRoles: React.FC<UserRolesProps> = ({
  userId,
  roles,
  canDeleteRoles,
  onRolesUpdate
}) => {
  const [loadingRoles, setLoadingRoles] = useState<Record<Role, boolean>>(
    {} as Record<Role, boolean>
  );

  const handleRemoveRole = async (role: Role) => {
    setLoadingRoles((prev) => ({ ...prev, [role]: true }));

    try {
      await UserRoleService.removeRoleFromUser(userId, { role });
      toast.success(`Роль ${role.replace('ROLE_', '')} удалена`, {
        description: 'Вы успешно изменили права доступа пользователя.'
      });
      const updatedRoles = roles.filter((r) => r !== role);
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

  const sortedRoles = [...roles].sort((a, b) => {
    const rolePriority: Record<string, number> = {
      ROLE_USER: 1,
      ROLE_MODERATOR: 2,
      ROLE_ADMIN: 3
    };
    return (rolePriority[a] || 99) - (rolePriority[b] || 99);
  });

  console.log(sortedRoles);

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
        </div>
      </div>
    </div>
  );
};
