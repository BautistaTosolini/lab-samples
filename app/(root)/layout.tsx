'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Navbar from '@/components/shared/Navbar';
import { UserInterface } from '@/lib/interfaces/models.interface';
import { Toaster } from 'react-hot-toast';

export const UserContext = createContext<UserInterface | null>(null);

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

          if (!user) {
            router.push('/');
            return null;
          }

          setIsAuthenticated(true);
        })
        .catch((error) => {
          router.push(`/`);
          return null;
        })
    }

    authenticateUser();
  }, [router])

  if (!isAuthenticated || !user) {
    return <LoadingSpinner />
  }

  return (
    <main className='w-full flex justify-center min-h-screen bg-gray-300'>
      <UserContext.Provider value={user}>
        <Navbar 
          user={user!}
        />
        <Toaster />
        {children}
      </UserContext.Provider>
    </main>
  )
};

export default DashboardLayout;