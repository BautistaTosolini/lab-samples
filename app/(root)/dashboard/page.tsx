'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import SampleCard from '@/components/cards/SampleCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TableHeader from '@/components/shared/TableHeader';
import toast, { Toaster } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/shared/Navbar';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import { Search } from 'lucide-react';
import LoadingSamples from '@/components/shared/LoadingSamples';

const Page = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [samples, setSamples] = useState<Samples[] | null>(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchParam, setSearchParam] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  //waits 0.5s before making the fetch request
  const debouncedValue = useDebounce<string>(searchParam, 500);

  useEffect(() => {
    const fetchSearchedSamples = async () => {
      const newPage = 1;

      if (searchParam.length === 0 && isMounted) {
        await axios.post(`/api/samples`, { currentPage: newPage })
          .then((response) => {
            const user = response.data.user;
            const samples = response.data.user.samples;
            const hasMore = response.data.hasMore;

            setUserInfo(user);
            setSamples(samples);
            setPage(newPage + 1);
            setHasMore(hasMore);
            
            if (!user) {
              router.push('/');
            }
            
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          })
      }

      if (searchParam.length > 0 && isMounted) {
        await axios.post(`/api/samples/search`, { searchParam, currentPage: newPage })
          .then((response) => {
            const searchedSamples = response.data.samples;
            const hasMore = response.data.hasMore;
            console.log(response.data)

            setPage(newPage + 1);
            setHasMore(hasMore);
            setSamples(searchedSamples);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          })
      }
    }

    fetchSearchedSamples();
    setIsMounted(true);

  }, [debouncedValue])
  
  //get user data and samples
  useEffect(() => {
    (async () => {
      await axios.post(`/api/samples`, { currentPage: page })
        .then((response) => {
          const user = response.data.user;
          const samples = response.data.user.samples;
          const hasMore = response.data.hasMore;

          setUserInfo(user);
          setSamples(samples);
          setPage(page + 1);
          setHasMore(hasMore);

          if (!user) {
            router.push('/');
          }

        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
    })()
  }, [])

  //get more samples when scrolling down
  const getMoreSamples = async () => {
    if (searchParam.length === 0) {
      setPage(page + 1);

      await axios.post(`/api/samples`, { currentPage: page })
        .then((response) => {
          const newSamples = response.data.user.samples;
          const hasMore = response.data.hasMore;

          setSamples([...samples!, ...newSamples || []]);
          setPage(page + 1);
          setHasMore(hasMore);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })

    } else {
      
      await axios.post(`/api/samples`, { searchParam, currentPage: page })
        .then((response) => {
          const user = response.data.user;
          const hasMore = response.data.hasMore;
          const newSamples = response.data.user.samples;

          setSamples([...samples!, ...newSamples || []]);
          setPage(page + 1);
          setHasMore(hasMore);

          if (!user) {
            router.push('/')
          }

        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
    }
  }

  //if userinfo is null show a loading screen
  if (!userInfo) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Toaster />

      <div className='flex flex-col gap-4 m-4 mt-16'>
        <div className='flex flex-row justify-between items-center gap-2 px-10'>
          <Label className='w-96 font-semibold text-lg'>
            Buscar por código de muestra:
          </Label>
          <div className='bg-white rounded-lg flex flex-row w-full items-center'>
            <Input
              className='w-full border-none focus-visible:outline-none'
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
            />
            <Search 
              className='mx-4'
            />
          </div>
        </div>

        <TableHeader />

        <div className='flex flex-col gap-2 h-full'>
          {samples!.length === 0 ? 
            <h1 className='text-center font-semibold text-lg'>Ninguna muestra encontrada.</h1> :
            <InfiniteScroll
              dataLength={samples!.length}
              next={getMoreSamples}
              hasMore={hasMore}
              loader={<LoadingSamples />}
            >
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
            </InfiniteScroll>
          }
        </div>
      </div>
    </>
  )
};

export default Page;