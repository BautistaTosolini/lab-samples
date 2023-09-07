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
import { API_BASE } from '@/constants';

interface Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Page = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const { email, password } = data;

    const payload = {
      email,
      password,
    }

    await axios.post(`${API_BASE}/api/auth/sign-in`, payload)
      .then(() => router.push('/dashboard'))
      .catch((error) => toast.error(error.response.data.message));
    
  };

  return (
    <Card className='w-[350px]'>
      <Toaster />
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

            <div className='flex justify-center'>
              <Button type='submit' className='w-40'>Enviar</Button>
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