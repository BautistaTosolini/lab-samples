'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import SampleForm from '@/components/form/sample-form';
import { getUser } from '@/lib/getUser';

import { UserInterface } from '@/lib/interfaces/models.interface';

const Page = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);

  let code = '';

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();
  
      if (error) {
        router.push('/');
        return;
      }

      if (user) {
        setUserInfo(user);
      }

    })()
  }, [router])

  return (
    <div className='m-4'>
      <Toaster />
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