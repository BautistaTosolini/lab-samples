'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import SampleCard from '@/components/cards/SampleCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TableHeader from '@/components/shared/TableHeader';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Label } from '@/components/ui/label';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import { Search } from 'lucide-react';
import LoadingSamples from '@/components/shared/LoadingSamples';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const Page = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [samples, setSamples] = useState<Samples[] | null>(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchParam, setSearchParam] = useState('');
  const [serviceType, setServiceType] = useState<'processing' | 'staining'>('processing');
  const [isMounted, setIsMounted] = useState(false);
  
  //waits 0.5s before making the fetch request
  const debouncedValue = useDebounce<string>(searchParam, 500);

  useEffect(() => {
    const fetchSearchedSamples = async () => {
      const newPage = 1;

      if (searchParam.length === 0 && isMounted) {
        await axios.get(`/api/samples?page=${newPage}&type=${serviceType}&type=${serviceType}`)
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
        await axios.get(`/api/samples/search?searchParam=${searchParam}&page=${newPage}&type=${serviceType}`)
          .then((response) => {
            const searchedSamples = response.data.samples;
            const hasMore = response.data.hasMore;

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
  
  // get user data and samples when mounting the page
  useEffect(() => {
    const getSamples = async () => {
      await axios.get(`/api/samples?page=${page}&type=${serviceType}`)
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
    }
    
    getSamples();
  }, [])

  // get more samples when scrolling down
  const getMoreSamples = async () => {

    if (searchParam.length === 0) {
      setPage(page + 1);

      await axios.get(`/api/samples?page=${page}&type=${serviceType}`)
        .then((response) => {
          const newSamples = response.data.user.samples;
          const hasMore = response.data.hasMore;

          if (!samples) {
            setSamples(newSamples);
          } else {
            setSamples([...samples!, ...newSamples || []]);
          }

          setPage(page + 1);
          setHasMore(hasMore);
        })
        .catch((error) => {
          if (error.response) {
            toast.error(error.response.data.message);
          }
        })

    } else {
      
      await axios.get(`/api/samples/search?searchParam=${searchParam}&page=${page}&type=${serviceType}`)
        .then((response) => {
          const user = response.data.user;
          const hasMore = response.data.hasMore;
          const newSamples = response.data.user.samples;

          if (!samples) {
            setSamples(newSamples);
          } else {
            setSamples([...samples!, ...newSamples || []]);
          }
          
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

  useEffect(() => {
    getMoreSamples();
  }, [serviceType])

  const alternateService = () => {
    setSamples(null);

    if (serviceType === 'processing') {
      setServiceType('staining');
      setPage(1);
      setHasMore(true);
    } else {
      setServiceType('processing');
      setPage(1);
      setHasMore(true);
    }
  }

  // if userinfo is null show a loading screen
  if (!userInfo || !samples) {
    return <LoadingSpinner />
  }

  return (
    <>

      <div className='flex flex-col gap-4 m-4 mt-16'>
        <div className='flex flex-row justify-between items-center gap-2 px-10'>
          <div className='flex flex-row gap-2 w-full items-center'>
            <Label className='font-semibold text-lg hidden sm:flex w-full'>
              Buscar por código de muestra:
            </Label>

            <div className='bg-white rounded-lg flex-row w-full items-center hidden sm:flex'>
              <Input
                className='w-full border-none focus-visible:outline-none'
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
              
              <Search 
                className='mx-4'
              />
            </div>

            <Button onClick={() => alternateService()}>
              {serviceType === 'processing' ? 'Procesamiento' : 'Tinción'}
            </Button>
          </div>


          <div className='bg-white rounded-lg flex flex-row w-full items-center sm:hidden'>
            <Input
              className='w-full border-none focus-visible:outline-none'
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              placeholder='Buscar por código...'
            />
            <Search 
              className='mx-4'
            />
          </div>

        </div>

        <TableHeader 
          type={serviceType}
          print={false}
        />

        <div className='flex flex-col gap-2 h-full'>
          {samples!.length === 0 ? 
            <h1 className='text-center font-semibold text-lg'>Ninguna muestra encontrada.</h1> :
            <InfiniteScroll
              dataLength={samples!.length}
              next={getMoreSamples}
              hasMore={hasMore}
              loader={<LoadingSamples />}
            >
              {samples.map((sample) => {
                if (serviceType === 'processing') {
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
                      finished={sample.finished}
                      _id={sample._id}
                      type={serviceType}
                    />
                  )
                } else {
                  return (
                    <SampleCard 
                      key={`${sample._id}-${sample.code}-${sample.date}`}
                      code={sample.code}
                      date={sample.createdAt}
                      researcher={`${sample.researcher.name} ${sample.researcher.lastname}`}
                      sampleType={sample.sampleType}
                      observations={sample.observations}
                      staining={sample.staining}
                      finished={sample.finished}
                      _id={sample._id}
                      type={serviceType}
                    />
                  )
                }
              })}
            </InfiniteScroll>
          }
        </div>
      </div>
    </>
  )
};

export default Page;