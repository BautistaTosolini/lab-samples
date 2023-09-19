'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

import SampleForm from '@/components/form/SampleForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

import { UserInterface } from '@/lib/interfaces/models.interface';

const Page = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticateUser = async () => {
      await axios.get('/api/auth/authenticate')
        .then((response) => {
          const user = response.data.user;

          if (!user || user.role === 'researcher') {
            router.push('/dashboard');
            return;
          }

          setUserInfo(user);
          setIsLoading(false);
        })
        .catch((error) => {
          router.push('/dashboard')
        })
    }

    authenticateUser();
  }, [router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className='m-4 mt-16'>
      <div>
        <SampleForm 
          userInfo={userInfo}
          onClick={() => router.push('/dashboard')}
        />
      </div>
    </div>
  )
}

export default Page;