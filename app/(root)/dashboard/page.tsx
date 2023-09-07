'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import SampleCard from '@/components/cards/sample-card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/shared/loading-spinner';
import { getSamples } from '@/lib/getSamples';
import TableHeader from '@/components/shared/table-header';

import fetchData from '@/lib/utils/fetchSamples';
import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import Navbar from '@/components/shared/navbar';

const Page = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [samples, setSamples] = useState<Samples[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [page, setPage] = useState(1);

  //logout button
  const onClick = async () => {
    await axios.get(`/api/auth/logout`)

    router.push('/')
  };
  
  //get user data and samples
  useEffect(() => {
    (async () => {
      await fetchData({ setIsLoading, setSamples, setUserInfo, router });
    })()
  }, [router])

  //fetch more samples when scrolling downwards
  useEffect(() => {
    const handleScroll = async () => {
      if (scrollEnabled && window.innerHeight + window.scrollY >= document.body.offsetHeight - 30) {
        setIsLoading(true);
        setScrollEnabled(false);

        setTimeout(async () => {
        const response = await getSamples(page);

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

  //if userinfo is null show a loading screen
  if (!userInfo) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Navbar 
        onClick={onClick}
      />
      <div className='flex flex-col gap-4 m-4 mt-10'>

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
        </div>

        <TableHeader />

        <div className='flex flex-col gap-2 h-full'>
          {samples?.map((sample) => {
            return (
              <SampleCard 
                key={`${sample._id}-${sample.code}-${sample.date}`}
                code={sample.code}
                date={sample.createdAt}
                researcher={`${sample.researcher.name} ${sample.researcher.lastname}`}
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

        {isLoading && (samples?.length ?? 0) >= 15 ? (
          <div className='w-full flex justify-center'>
            <div className='loader ease-linear rounded-full border-4 border-t-4 border-white h-12 w-12 mb-4' />
          </div> 
          ) : (null)}

      </div>
    </>
  )
};

export default Page;