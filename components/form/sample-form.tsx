import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SampleSchema } from '@/lib/validations/sample';
import { API_BASE } from '@/constants';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/shared/loading-spinner';
import { Label } from '@/components/ui/label';

import { CustomError, UserInterface } from '@/lib/interfaces/models.interface';

interface SampleFormProps {
  onClick: () => void;
  userInfo: UserInterface | null;
}

const SampleForm = ({ onClick, userInfo }: SampleFormProps) => {
  const router = useRouter();
  const [researchers, setResearchers] = useState<UserInterface[] | null>(null);
  const [selectedResearcher, setSelectedResearcher] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const form = useForm({
    resolver: zodResolver(SampleSchema),
    defaultValues: {
      sampleType: '',
      observations: '',
    },
  });

  const selectResearcher = (researcher: UserInterface) => {
    setSelectedResearcher(researcher)

    const first = researcher?.name[0].toUpperCase();
    const last = researcher?.lastname[0].toUpperCase();

    if (first && last) {
      const result = first + last + '-' + researcher.samples.length;

      setCode(result);
    } 
  }

  const onSubmit = async (data: z.infer<typeof SampleSchema>) => {
    const { sampleType, observations } = data;

    const payload = {
      code,
      researcher: selectedResearcher?._id,
      sampleType,
      observations,
    }

    await axios.post(`${API_BASE}/api/samples/create`, payload)
      .then(() => {
        toast.success('Muestra creada');

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Ocurrió un error')
      })
  
  };

  useEffect(() => {
    (async () => {
      await axios.get(`${API_BASE}/api/users`)
        .then((response) => {
          setResearchers(response.data.users);
          setIsLoading(false);
        })
        .catch((error) => toast.error(error.message));
    })()
  }, [])

  if (isLoading || !researchers) {
    return <LoadingSpinner />
  }

  return (
    <Card>
      <Toaster />
      <CardHeader>
        <CardTitle>Modificar Muestra</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

            <Label>
              Código de Muestra
            </Label>
            <div className={`flex h-10 w-full rounded-md border bg-gray-200 px-3 py-2 text-sm my-2 ${code.length > 0 ? 'text-black' : 'text-gray-500'}`}>
              {code.length > 0 ? `${code}` : 'Seleccione un investigador...'}
            </div>

            <FormField
              control={form.control}
              name='sampleType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Muestra</FormLabel>
                  <FormControl>
                    <Input 
                      className='bg-gray-200'
                      type='string'
                      placeholder='Ingrese el tipo de muestra...' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='observations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      className='bg-gray-200 row-5'
                      placeholder='Observaciones...' 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <Label>
                Investigador:
              </Label>
              <div className='flex h-64 w-full flex-col rounded-md border bg-gray-200 text-sm mb-2 overflow-y-auto gap-2 py-1'>
                {researchers?.map((researcher) => {
                  return (
                    <div
                    key={researcher._id}
                    className={`flex flex-col cursor-pointer hover:bg-gray-400 rounded-sm w-full px-2 font-bold ${selectedResearcher === researcher ? 'bg-gray-400' : ''}`}
                    onClick={() => selectResearcher(researcher)}
                    >
                      {researcher.name} {researcher.lastname} - {researcher.email}
                      <Separator className='bg-gray-400' />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='flex justify-center gap-4'>
              <Button 
                onClick={onClick}
                type='button' 
                className='w-40'
              >
                Volver
              </Button>
              <Button type='submit' className='w-40'>Guardar</Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SampleForm;