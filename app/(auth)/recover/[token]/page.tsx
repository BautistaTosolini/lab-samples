'use client'

import axios from 'axios';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Page = ({ params }: { params: { token: string } }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const authenticate = async () => {
      await axios.post(`/api/auth/recover/${params.token}`)
        .then(() => {
          toast.success('Autenticado correctamente');
          setIsLoading(false);
        })
        .catch(() => {
          router.push('/');
        })
    }

    authenticate();
  }, [])

  const onSubmit = async () => {
    setSubmiting(true);

    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }

    await axios.put(`/api/auth/recover`, { password })
      .then(() => {
        router.push('/dashboard');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setSubmiting(false);
      })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Card className='w-[350px]'>
    <Toaster />
    <CardHeader>
      <CardTitle>Reestablecer Contraseña</CardTitle>
      <CardDescription>Muestras de Laboratorio</CardDescription>
    </CardHeader>
    <CardContent className='gap-4 flex flex-col'>
      <Label>
        Contraseña Nueva:
      </Label>
      <Input 
        placeholder='Ingrese su contraseña...'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='bg-gray-200'
        type='password'
      />

      <Label>
        Confirmar Contraseña:
      </Label>
      <Input 
        placeholder='Ingrese su contraseña...'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className='bg-gray-200'
        type='password'
      />

      <div className='flex justify-center gap-4'>
        <Button 
          onClick={submiting ? () => {} : onSubmit} 
          className={`w-40 ${submiting ? 'cursor-progress hover:bg-primary' : ''}`}
        >
          {submiting ? 'Cargando...' : 'Guardar'}
        </Button>
      </div>
    </CardContent>
  </Card>
  )
};

export default Page;