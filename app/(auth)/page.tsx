'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useState } from 'react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoginSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
  const router = useRouter();
  const [submiting, setSubmiting] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setSubmiting(true);
    const { email, password } = data;

    const payload = {
      email,
      password,
    }

    await axios.post(`/api/auth/sign-in`, payload)
      .then(() => {
        toast.success('Sesión iniciada');

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setSubmiting(false);
      });
    
  };

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-gray-200'
                      type='email'
                      placeholder='Ingrese su e-mail...' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input 
                      className='bg-gray-200'
                      type='password'
                      placeholder='Ingrese su contraseña...' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className='text-xs flex'>
              ¿Contraseña olvidada?
                <span 
                  className='text-purple-800 cursor-pointer mx-1'
                  onClick={() => router.push('/recover')}
                >
                  Reestablecer.
                </span> 
            </span>

            <div className='flex justify-center'>
              <Button 
                type={submiting ? 'button' : 'submit'} 
                className={`w-40 ${submiting ? 'cursor-progress hover:bg-primary' : ''}`}
              >
                {submiting ? 'Cargando...' : 'Enviar'}
              </Button>
            </div>
            <span className='text-sm flex justify-center'>
              ¿No tienes una cuenta?
                <span 
                  className='text-purple-800 cursor-pointer mx-1'
                  onClick={() => router.push('/sign-up')}
                >
                  Registrate
                </span> 
              aquí.
            </span>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};

export default Page;