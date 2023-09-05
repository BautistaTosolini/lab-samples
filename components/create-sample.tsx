'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoginSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SampleSchema } from '@/lib/validations/sample';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CreateSampleInterface {
  author: string;
  onClose: () => void;
}

const CreateSample = ({ author, onClose }: CreateSampleInterface) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SampleSchema),
    defaultValues: {
      code: '',
      sampleType: '',
      observations: '',
      inclusion: false,
      semithin: false,
      thin: false,
      grid: false,
    }
  })

  const onSubmit = async (data: z.infer<typeof SampleSchema>) => {
    const { code, sampleType, observations, inclusion, semithin, thin, grid } = data;

    try {
      const sample = await axios.post('/api/samples/create', {
        author,
        code,
        sampleType,
        observations,
        inclusion,
        semithin,
        thin,
        grid,
      })

      if (sample) {
        toast.success('Muestra creada');
      }

      form.reset();
      
    } catch (e) {
      const error = e as Error;

      toast.error(error.response?.data?.message || 'Ocurrió un error')
    }
  
  };

  return (
    <Card className='w-[350px] border-2 border-gray-500 h-[600px]'>
      <Toaster />
      <CardHeader>
        <CardTitle>Agregar Muestra</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Ingreso</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-gray-200'
                      type='string'
                      placeholder='Ingrese el código...' 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name='inclusion'
              render={({ field }) => (
                <FormItem className='flex justify-between m-2'>
                  <FormLabel>Inclusión</FormLabel>
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='semithin'
              render={({ field }) => (
                <FormItem className='flex justify-between m-2'>
                  <FormLabel>Semi Fino</FormLabel>
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='thin'
              render={({ field }) => (
                <FormItem className='flex justify-between m-2'>
                  <FormLabel>Fino</FormLabel>
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='grid'
              render={({ field }) => (
                <FormItem className='flex justify-between m-2'>
                  <FormLabel>Grilla</FormLabel>
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-center gap-4'>
              <Button onClick={onClose} type='button' className='w-40'>Volver</Button>
              <Button type='submit' className='w-40'>Enviar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};

export default CreateSample;