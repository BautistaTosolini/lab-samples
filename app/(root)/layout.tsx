'use client';

import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import LoadingSpinner from '@/components/loading-spinner';
import { getUser } from '@/lib/getUser';

interface UserResponse {
  user: string | null;
  error: AxiosError | null;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        router.push('/sign-in');
        return;
      }

      setIsAuthenticated(true);

    })()
  }, [router])

  if (!isAuthenticated) {
    return <LoadingSpinner />
  }

  return (
    <main className='w-full flex justify-center items-center min-h-screen bg-gray-300'>
      {children}
    </main>
  )
};

export default DashboardLayout;