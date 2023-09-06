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

  const defaultValues = {
    code: '',
    sampleType: '',
    observations: '',
    inclusion: false,
    semithin: false,
    thin: false,
    grid: false,
  };

  const resolver = zodResolver(SampleSchema);

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();
  
      if (error) {
        router.push('/sign-in');
        return;
      }

      if (user) {
        setUserInfo(user);
      }

    })()
  }, [router])

  const onSubmit = async (data: z.infer<typeof SampleSchema>) => {
    const { code, sampleType, observations, inclusion, semithin, thin, grid } = data;

    const payload = {
      author: userInfo?._id,
      code,
      sampleType,
      observations,
      inclusion,
      semithin,
      thin,
      grid,
    }

    try {
      const sample = await axios.post(`${API_BASE}/api/samples/create`, payload)

      if (sample) {
        toast.success('Muestra creada');

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
      
    } catch (e) {
      const error = e as CustomError;

      toast.error(error.response?.data?.message || 'Ocurrió un error')
    }
  
  };

  return (
    <div className='absolute inset-0 flex justify-center backdrop-blur m-4 h-full'>
      <Toaster />
      <div>
        <SampleForm 
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={resolver}
          onClick={() => router.push('/dashboard')}
        />
      </div>
    </div>
  )
}

export default Page;