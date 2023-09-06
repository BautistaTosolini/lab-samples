'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { SampleSchema } from '@/lib/validations/sample';
import { API_BASE } from '@/constants';
import LoadingSpinner from '@/components/shared/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SampleForm from '@/components/form/sample-form';
import SampleDetailsCards from '@/components/cards/sample-details-card';
import AssignedSamplesCard from '@/components/cards/assigned-samples-card';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [sample, setSample] = useState<Samples | null>(null);
  const [author, setAuthor] = useState<UserInterface | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    code: '',
    sampleType: '',
    observations: '',
    inclusion: false,
    semithin: false,
    thin: false,
    grid: false,
  });

  const resolver = zodResolver(SampleSchema);

  //update the form when the sample came from the backend
  useEffect(() => {
    if (sample) {
      setDefaultValues({
      code: sample.code,
      sampleType: sample.sampleType,
      observations: sample.observations,
      inclusion: sample.inclusion,
      semithin: sample.semithin,
      thin: sample.thin,
      grid: sample.grid,
    });

      setIsFormReady(true);

    }
  }, [sample]);

  const onSubmit = (data: z.infer<typeof SampleSchema>) => {
    console.log(data)
  }

  //get the sample and author information
  useEffect(() => {
    (async () => {
      await axios.get(`${API_BASE}/api/samples/${params.id}`)
        .then((response) => {
          setSample(response.data.sample)
          setAuthor(response.data.sample.author)
        })
        .catch((error) => toast.error(error.message));
    })()
  }, [router, params.id])

  if (!author || !sample || !isFormReady) {
    return <LoadingSpinner />
  }

  const createdAtDate = new Date(sample.createdAt)
  const updatedAtDate = new Date(sample.updatedAt)

  return (
    <Tabs defaultValue='account' className='w-[400px] m-4'>
      <TabsList className='w-full flex justify-between p-4'>
        <TabsTrigger value='account'>Muestra</TabsTrigger>
        <TabsTrigger value='details'>Detalles</TabsTrigger>
        <TabsTrigger value='assigned'>Asignados</TabsTrigger>
      </TabsList>

      <TabsContent value='account'>
        <SampleForm 
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={resolver}
          onClick={() => router.back()}
        />
      </TabsContent>

      <TabsContent value='details'>
        <SampleDetailsCards 
          author={author}
          sample={sample}
        />
      </TabsContent>

      <TabsContent value='assigned'>
        <AssignedSamplesCard 
          id={params.id}
        />
      </TabsContent>
    </Tabs>
  )
}

export default Page