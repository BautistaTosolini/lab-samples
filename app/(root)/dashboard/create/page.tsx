'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import SampleForm from '@/components/form/sample-form';
import { getUser } from '@/lib/getUser';
import { API_BASE } from '@/constants';
import { SampleSchema } from '@/lib/validations/sample';

import { CustomError, UserInterface } from '@/lib/interfaces/models.interface';

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