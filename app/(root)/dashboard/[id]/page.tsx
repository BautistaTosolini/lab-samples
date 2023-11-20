'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { UpdateSampleSchema } from '@/lib/validations/sample';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SampleDetailsCard from '@/components/cards/SampleDetailsCard';
import ResearcherDetailsCard from '@/components/cards/ResearcherDetailsCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import { Form } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [sample, setSample] = useState<Samples | null>(null);
  const [researcher, setResearcher] = useState<UserInterface | null>(null);

  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const deleteSample = async () => {
    setSubmiting(true);
    const sampleId = params.id;

    await axios.delete(`/api/samples/${sampleId}`)
      .then((response) => {
        toast.success(response.data.message);
        router.push('/dashboard');
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Ocurrió un error');
        setSubmiting(false);
      })
  }

  const onSubmit = async (data: z.infer<typeof UpdateSampleSchema>) => {
    setSubmiting(true);
    const { 
      observations, 
      inclusion, 
      semithin, 
      thin, 
      grid, 
      finished 
    } = data;

    const payload = {
      observations,
      inclusion,
      semithin,
      thin,
      grid,
      sampleId: params.id,
      finished,
    }

    await axios.put(`/api/samples`, payload)
      .then((response) => {
        toast.success(response.data.message);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Ocurrió un error');
        setSubmiting(false);
      })
  }

  const form = useForm({
    resolver: zodResolver(UpdateSampleSchema),
    defaultValues: {
      observations: sample ? sample.observations : '',
      inclusion: sample ? sample.inclusion : false,
      semithin: sample ? sample.semithin : false,
      thin: sample ? sample.thin : false,
      grid: sample ? sample.grid : false,
      finished: sample ? sample.finished : false,
    },
  });

  //get the sample, researcher and user information
  useEffect(() => {
    const fetchSampleData = async () => {
      await axios.get(`/api/samples/${params.id}`)
        .then((response) => {
          const sample = response.data.sample;
          const researcher = response.data.sample.researcher;

          setSample(sample);
          setResearcher(researcher);
          setIsLoading(false);
          form.reset({
            observations: sample.observations,
            inclusion: sample.inclusion,
            semithin: sample.semithin,
            thin: sample.thin,
            grid: sample.grid,
            finished: sample.finished,
          });
        })
        .catch((error) => {
          toast.error('Muestra no encontrada');
          router.push('/dashboard');
        });
    }

    const fetchUserData = async () => {
      await axios.get(`/api/auth/authenticate`)
        .then((response) => {
          const user = response.data.user;
          
          setUserInfo(user);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }

    fetchSampleData();
    fetchUserData();
  }, [])

  if (isLoading || !userInfo) {
    return <LoadingSpinner />
  }

  if (!sample || !researcher) {
    return router.push('/dashboard');
  }

  return (
    <Tabs defaultValue='details' className='w-[400px] m-4 gap-4 flex flex-col mt-16'>
      <TabsList className='w-full flex justify-between'>
        <TabsTrigger value='details' className='w-full'>Detalles</TabsTrigger>
        <TabsTrigger value='researcher' className='w-full'>Investigador</TabsTrigger>
      </TabsList>
      <Card>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

              <TabsContent value='details'>
                <SampleDetailsCard 
                  sample={sample}
                  form={form}
                  user={userInfo!}
                />
              </TabsContent>

              <TabsContent value='researcher'>
                <ResearcherDetailsCard
                  researcher={researcher}
                />
              </TabsContent>

              <div className='flex w-full justify-center gap-4 mt-4'>
                {userInfo.role === 'admin' ?
                <>
                  <AlertDialog>
                    <AlertDialogTrigger className='w-full'>
                      <Button
                        variant='destructive'
                        className={`w-full ${submiting ? 'cursor-progress' : ''}`}
                        type='button'
                        >
                        Borrar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteSample}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
                : 
                  null
                }
                <Button 
                  className='w-full'
                  type='button'
                  onClick={() => router.push('/dashboard')}
                >
                  Volver
                </Button>
                {userInfo.role !== 'researcher' ?
                  <Button 
                  type={submiting ? 'button' : 'submit'} 
                  className={`w-full ${submiting ? 'cursor-progress' : ''}`}
                  >
                  {submiting ? 'Cargando...' : 'Guardar'}
                  </Button>
                : null}
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </Tabs>
  )
}

export default Page