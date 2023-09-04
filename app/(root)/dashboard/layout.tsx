'use client';

import LoadingSpinner from '@/components/loading-spinner';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
    <main>
      {children}
    </main>
  )
};

const getUser = async (): Promise<UserResponse> => {
  try {
    const { data } = await axios.get('/api/auth/authenticate')

    return { user: data, error: null }

  } catch (e) {
    const error = e as AxiosError;

    return { user: null, error }
  }
}

export default DashboardLayout;