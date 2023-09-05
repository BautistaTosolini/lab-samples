'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from '@/components/ui/form';
import { SampleSchema } from '@/lib/validations/sample';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { API_BASE } from '@/constants';

const Page = ({ params }: { params: { id: string } }) => {
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

  const onSubmit = (data: z.infer<typeof SampleSchema>) => {
    console.log(data)
  }

  useEffect(() => {
    (async () => {
      const result = await axios.get(`${API_BASE}/samples/${params.id}`);
  
      console.log(result)

    })()
  }, [router, params.id])

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
              <Button onClick={() => router.back()} type='button' className='w-40'>Volver</Button>
              <Button type='submit' className='w-40'>Guardar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Page