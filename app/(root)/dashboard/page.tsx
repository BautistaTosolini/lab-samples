'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import SampleCard from '@/components/cards/sample-card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/shared/loading-spinner';
import { getSamples } from '@/lib/getSamples';
import { API_BASE } from '@/constants';
import TableHeader from '@/components/shared/table-header';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';

const Page = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [samples, setSamples] = useState<Samples[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [page, setPage] = useState(1);

  //logout button
  const onClick = async () => {
    await axios.get(`${API_BASE}/api/auth/logout`)

    router.push('/sign-in')
  };
  
  //get user data and samples
  useEffect(() => {
    (async () => {
      await getSamples(page)
        .then((response) => {
          const { user } = response;

          if (user) {
            setUserInfo(user)
            setSamples(user.samples)
            return;
          }

          router.push('/sign-in')
        })
        .catch((error) => router.push('/sign-in'));

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
        console.log(response)
        const newSamples = response.user?.samples

        if (samples && (newSamples?.length ?? 0) > 0) {
          setSamples([...samples, ...newSamples || []]);
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

  console.log('PAGE:', page)
  console.log('ISLOADING:', isLoading)
  console.log('SCROLL ENABLED:', scrollEnabled)

  //if userinfo is null show a loading screen
  if (!userInfo) {
    return <LoadingSpinner />
  }

  return (
    <div className='flex flex-col gap-4 m-4'>
      <Toaster />

      <span className='font-bold text-xl justify-center flex mt-2'>
        Bienvenido {userInfo.name}
      </span>

      <div className='flex flex-row justify-between p-2 gap-4'>
        <Button 
          className='w-full'
          onClick={() => router.push('/dashboard/create')}
        >
          Agregar Muestra
        </Button>
        <Button 
          className='w-full'
          onClick={onClick}
        >
          Cerrar Sesión
        </Button>
      </div>

      <TableHeader />

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
              _id={sample._id}
            />
          )
        })}
      </div>

      {isLoading && scrollEnabled || (samples?.length ?? 0) > 0 ? (
        <div className='w-full flex justify-center'>
          <div className='loader ease-linear rounded-full border-4 border-t-4 border-black h-12 w-12 mb-4' />
        </div> 
        ) : (null)}

    </div>
  )
};

export default Page;