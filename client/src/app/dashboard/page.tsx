'use client';

import { redirect } from 'next/navigation';
import { useSelector } from '@/hooks/use-redux';

export default function Dashboard() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
