'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

import LoadingSpinner from '@/components/shared/LoadingSpinner';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const authenticateUser = async () => {
      await axios.get('/api/auth/authenticate')
        .then((response) => {
          const user = response.data.user;

          if (user) {
            setIsAuthenticated(true);
          } else {
            router.push(`/`);
          }
        })
        .catch((error) => {
          router.push(`/`)
        })
    }

    authenticateUser();
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