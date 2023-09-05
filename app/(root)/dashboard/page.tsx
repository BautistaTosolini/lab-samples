'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import SampleCard from '@/components/sample-card';
import { Button } from '@/components/ui/button';
import CreateSample from '@/components/create-sample';
import { getUser } from '@/lib/getUser';
import LoadingSpinner from '@/components/loading-spinner';
import { getSamples } from '@/lib/getSamples';
import { Samples, UserInterface } from '@/lib/interfaces/models.interface';

const Page = () => {
  const router = useRouter();
  const [isCreateSampleVisible, setCreateSampleVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [samples, setSamples] = useState<Samples[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [page, setPage] = useState(1);

  //open-close create sample window
  const onClickAddSample = () => {
    setCreateSampleVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const onCloseCreateSample = () => {
    setCreateSampleVisible(false);
    document.body.style.overflow = 'auto';
  };

  //logout button
  const onClick = async () => {
    await axios.get('/api/auth/logout')

    router.push('/sign-in')
  };
  
  //get user data and samples
  useEffect(() => {
    (async () => {
      const { user, error } = await getSamples(page);
  
      if (error) {
        router.push('/sign-in');
        return;
      }

      if (user) {
        setUserInfo(user);
        setSamples(user.samples);
      }

    })()
  }, [router, page])

  //fetch more samples when scrolling downwards
  useEffect(() => {
    const handleScroll = async () => {
      if (scrollEnabled && window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !isLoading) {
        setIsLoading(true);
        setScrollEnabled(false);

        setTimeout(async () => {
        const response = await getSamples(page);

        if (samples && response.user?.samples) {
          setSamples([...samples, ...response.user.samples]);
          setPage(page + 1);
          setIsLoading(false);
          setScrollEnabled(true);

        } else {
          setIsLoading(false);
          setScrollEnabled(false);
        }
      }, 300);
    };
  }

    //add scrolling event
    window.addEventListener('scroll', handleScroll);

    //deleting scrolling event when dismounting
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, samples, page, scrollEnabled]);

  if (!userInfo) {
    return <LoadingSpinner />
  }

  return (
    <div className='flex flex-col gap-4 m-4'>
      <span className='font-bold text-xl justify-center flex mt-2'>
        Bienvenido {userInfo.name}
      </span>
      <div className='flex flex-row justify-between p-2 gap-4'>
        <Button 
          className='w-full'
          onClick={onClickAddSample}
        >
          Agregar Muestra
        </Button>
        <Button 
          className='w-full'
          onClick={onClick}
        >
          Cerrar Sesión
        </Button>
        <div className={`${ isCreateSampleVisible ? 'block' : 'hidden'} absolute inset-0 flex items-center justify-center backdrop-blur m-2 h-full`}>
          <CreateSample 
            author={userInfo._id} 
            onClose={onCloseCreateSample}  
          />
        </div>
      </div>
      <div className='flex gap-5 bg-white rounded-lg p-4 border border-gray-300'>
        <div className='flex flex-col'>
          <h2 className='text-lg font-semibold mb-4 text-center border-b-2 border-black'>Registro de Ingresos</h2>
          <div className='flex gap-4 text-center'>
            <span className='font-semibold w-20 border-b-2 border-black'>Código</span>
            <span className='font-semibold w-36 border-b-2 border-black'>Fecha de Ingreso</span>
            <span className='font-semibold w-32 border-b-2 border-black'>Investigador</span>
            <span className='font-semibold w-32 border-b-2 border-black'>Tipo de Muestra</span>
            <span className='font-semibold w-56 border-b-2 border-black'>Observaciones</span>
          </div>
        </div>
        <div className='flex flex-col'>
          <h2 className='text-lg font-semibold mb-4 text-center border-b-2 border-black'>Estado</h2>
          <div className='grid grid-cols-4 gap-2 text-center'>
            <span className='w-20 font-semibold border-b-2 border-black'>Inclusión</span>
            <span className='w-20 font-semibold border-b-2 border-black'>Semi Fino</span>
            <span className='w-20 font-semibold border-b-2 border-black'>Fino</span>
            <span className='w-20 font-semibold border-b-2 border-black'>Grilla</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 h-full'>
        
        {samples?.map((sample) => {
          return (
            <SampleCard 
              key={`${sample._id}-${sample.code}-${sample.date}`}
              code={sample.code}
              date={sample.createdAt}
              researcher={sample.author.name}
              sampleType={sample.sampleType}
              observations={sample.observations}
              inclusion={sample.inclusion}
              semithin={sample.semithin}
              thin={sample.thin}
              grid={sample.grid}
            />
          )
        })}
      </div>
      {isLoading || scrollEnabled ? (
        <div className='w-full flex justify-center'>
          <div className='loader ease-linear rounded-full border-4 border-t-4 border-black h-12 w-12 mb-4' />
        </div> 
        ) : (null)}
    </div>
  )
};

export default Page;