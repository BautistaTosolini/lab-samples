'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Navbar from '@/components/shared/Navbar';
import { UserInterface } from '@/lib/interfaces/models.interface';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      await axios.get('/api/auth/authenticate')
        .then((response) => {
          const user = response.data.user;

          setUser(user);

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

  if (!isAuthenticated && !user) {
    return <LoadingSpinner />
  }

  return (
    <main className='w-full flex justify-center min-h-screen bg-gray-300'>
      <Navbar 
        user={user!}
      />
      <Toaster />
      {children}
    </main>
  )
};

export default DashboardLayout;