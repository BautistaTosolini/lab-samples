'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { SampleSchema, UpdateSampleSchema } from '@/lib/validations/sample';
import { API_BASE } from '@/constants';
import LoadingSpinner from '@/components/shared/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SampleDetailsCard from '@/components/cards/sample-details-card';
import ResearcherDetailsCard from '@/components/cards/researcher-details-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import { Form } from '@/components/ui/form';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [sample, setSample] = useState<Samples | null>(null);
  const [researcher, setResearcher] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const onSubmit = async (data: z.infer<typeof UpdateSampleSchema>) => {
    const { inclusion, semithin, thin, grid } = data;

    const payload = {
      inclusion,
      semithin,
      thin,
      grid,
      sampleId: params.id,
    }

    await axios.post(`${API_BASE}/api/samples/update`, payload)
      .then((response) => {
        toast.success(response.data.message)

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Ocurrió un error')
      })
  }

  const form = useForm({
    resolver: zodResolver(UpdateSampleSchema),
    defaultValues: {
      inclusion: sample ? sample.inclusion : false,
      semithin: sample ? sample.semithin : false,
      thin: sample ? sample.thin : false,
      grid: sample ? sample.grid : false,
    },
  });

  //get the sample and researcher information
  useEffect(() => {
    (async () => {
      await axios.get(`${API_BASE}/api/samples/${params.id}`)
        .then((response) => {
          setSample(response.data.sample);
          setResearcher(response.data.sample.researcher);
          setIsLoading(false);
          form.reset({
            inclusion: response.data.sample.inclusion,
            semithin: response.data.sample.semithin,
            thin: response.data.sample.thin,
            grid: response.data.sample.grid,
          });
        })
        .catch((error) => toast.error(error.message));
    })()
  }, [router, params.id, form])

  console.log(sample)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!sample || !researcher) {
    return router.push('/dashboard');
  }

  return (
    <Tabs defaultValue='details' className='w-[400px] m-4 gap-4 flex flex-col'>
      <TabsList className='w-full flex justify-between'>
        <TabsTrigger value='details' className='w-full'>Detalles</TabsTrigger>
        <TabsTrigger value='researcher' className='w-full'>Investigador</TabsTrigger>
      </TabsList>
      <Card>
        <CardContent>
          <Toaster />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

              <TabsContent value='details'>
                <SampleDetailsCard 
                  sample={sample}
                  form={form}
                />
              </TabsContent>

              <TabsContent value='researcher'>
                <ResearcherDetailsCard
                  researcher={researcher}
                />
              </TabsContent>

              <div className='flex w-full justify-center gap-4 mt-4'>
                <Button 
                  className='w-full'
                  type='button'
                  onClick={() => router.push('/dashboard')}
                >
                  Volver
                </Button>
                <Button
                  className='w-full'
                >
                  Guardar
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </Tabs>
  )
}

export default Page