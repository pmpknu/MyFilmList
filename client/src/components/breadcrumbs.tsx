'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { isAdmin, isExactlyModerator } from '@/features/users/rbac';
import { useBreadcrumbs, BreadcrumbItem as BreadcrumbType } from '@/hooks/use-breadcrumbs';
import { UserDto } from '@/interfaces/user/dto/UserDto';
import { Slash } from 'lucide-react';
import { Fragment } from 'react';

const UserBreadcrumb = ({ user, title }: { user: UserDto; title: string }) => {
  return (
    <span
      className={`font-bold ${isAdmin(user) ? 'text-destructive' : isExactlyModerator(user) ? 'text-blue-600' : ''} dark:${isAdmin(user) ? 'text-destructive' : isExactlyModerator(user) ? 'text-blue-500' : ''}`}
    >
      {title}
    </span>
  );
};

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  const itemContent = (item: BreadcrumbType) => {
    console.log(item);
    return item?.options?.user ? (
      <UserBreadcrumb title={item.title} user={item?.options?.user} />
    ) : (
      item.title
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className='hidden md:block'>
                {item.link === '#' ? (
                  <BreadcrumbLink className='cursor-default hover:text-muted-foreground'>
                    {item.title}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='hidden md:block'>
                <Slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && <BreadcrumbPage>{itemContent(item)}</BreadcrumbPage>}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
