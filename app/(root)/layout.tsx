'use client';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import LoadingSpinner from '@/components/shared/loading-spinner';
import { getUser } from '@/lib/getUser';
import { API_BASE } from '@/constants';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        router.push(`${API_BASE}/sign-in`);
        return;
      }

      setIsAuthenticated(true);

    })()
  }, [router])

  if (!isAuthenticated) {
    return <LoadingSpinner />
  }

  return (
    <main className='w-full flex justify-center min-h-screen bg-gray-300'>
      {children}
    </main>
  )
};

export default DashboardLayout;