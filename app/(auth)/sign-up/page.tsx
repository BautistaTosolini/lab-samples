'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RegisterSchema } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }

    const payload = {
      name,
      email,
      password,
    }

    try {
      await axios.post('/api/auth/sign-in', payload)
      
      router.push('/dashboard');

    } catch (e) {
      const error = e as Error;

      toast.error(error.response?.data?.message || 'Ocurrió un error')
    }
    
  };

  return (
    <Card className='w-[350px]'>
      <Toaster />
      <CardHeader>
        <CardTitle>Registrarse</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      className='bg-gray-200'
                      type='text'
                      placeholder='Ingrese su nombre...' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-gray-200'
                      type='password'
                      placeholder='Repita su contraseña...' 
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
              ¿Ya tienes una cuenta?
                <span 
                  className='text-purple-800 cursor-pointer mx-1'
                  onClick={() => router.push('/sign-in')}
                >
                  Inicia sesión
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