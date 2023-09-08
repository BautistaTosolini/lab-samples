'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import SampleCard from '@/components/cards/sample-card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/shared/loading-spinner';
import { getSamples } from '@/lib/getSamples';
import TableHeader from '@/components/shared/table-header';
import toast, { Toaster } from 'react-hot-toast';
import fetchData from '@/lib/utils/fetchSamples';
import Navbar from '@/components/shared/navbar';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Label } from '@/components/ui/label';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import { Search } from 'lucide-react';

const Page = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [samples, setSamples] = useState<Samples[] | null>(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [samplesLength, setSamplesLength] = useState(0);

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
            const samplesLength = response.data.samplesLength;

            console.log('1 - INTIAL PAGE REQUEST:', newPage)
            console.log('2 - INITIAL RESPONSE:', response.data)
            console.log('3 - HASMORE:', hasMore)
            console.log('4 - samplesLength:', samplesLength)

            setUserInfo(user);
            setSamples(samples);
            setPage(newPage + 1);
            setHasMore(hasMore);
            setSamplesLength(samplesLength);

            if (!user) {
              router.push('/')
            }

          })
          .catch((error) => {
            console.log(error)
          })
      }

      if (isMounted) {
        await axios.post(`/api/samples/search`, { searchParam, currentPage: newPage })
          .then((response) => {
            console.log('SEARCHED RESPONSE:', response.data)
            console.log('SEARCH PARAMS:', searchParam)
            console.log('SEARCHED PAGE:', newPage)
            const searchedSamples = response.data.samples;

            setPage(newPage + 1);
            setSamples(searchedSamples)
          })
          .catch((error) => {
            console.log(error)
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
          const samplesLength = response.data.samplesLength;

          console.log('INITIAL RESPONSE:', response.data)

          setUserInfo(user);
          setSamples(samples);
          setPage(page + 1);
          setHasMore(hasMore);
          setSamplesLength(samplesLength);

          if (!user) {
            router.push('/')
          }

        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    })()
  }, [])

  //get more samples when scrolling down
  const getMoreSamples = async () => {
    if (searchParam.length === 0) {
      console.log('[========SEARCHING MORE WITHOUT PARAMS========]')
      setPage(page + 1);

      if (page > 3) {
        setHasMore(false)
      }

      await axios.post(`/api/samples`, { currentPage: page })
        .then((response) => {
          console.log('RESPONSE:', response.data)
          const newSamples = response.data.user.samples;
          const hasMore = response.data.hasMore;

          setSamples([...samples!, ...newSamples || []]);
          setPage(page + 1);
          setHasMore(hasMore);
        })
        .catch((error) => {
          console.log(error);
        })

    } else {
      console.log('[========SEARCHING MORE WITH PARAMS========]')
      await axios.post(`/api/samples`, { currentPage: page })
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
          toast.error(error.response.data.message)
        })
    }
  }

  console.log('PAGE:', page)
  console.log('hasMore:', hasMore)
  console.log('samplesLength:', samplesLength)
  console.log('searchParam length:', searchParam.length)
  console.log('-----------')

  //if userinfo is null show a loading screen
  if (!userInfo) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Navbar
        user={userInfo}
      />

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
          <InfiniteScroll
            dataLength={samplesLength}
            next={getMoreSamples}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<h4>All samples fetched</h4>}
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
        </div>
      </div>
    </>
  )
};

export default Page;