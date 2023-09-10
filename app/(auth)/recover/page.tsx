'use client'

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Page = () => {
  const router = useRouter();

  const [submiting, setSubmiting] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    setSubmiting(true);

    await axios.post('/api/auth/recover', { email })
      .then(() => {
        router.push('/recover/sent')
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setSubmiting(false);
      })
  }

  return (
    <Card className='w-[350px]'>
      <Toaster />
      <CardHeader>
        <CardTitle>Recuperar Cuenta</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent className='gap-4 flex flex-col'>
        <Label>
          Ingrese el E-Mail de su cuenta:
        </Label>
        <Input 
          placeholder='Ingrese su e-mail...'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-gray-200'
          type='email'
        />
        <span className='text-sm flex'>
          Se enviará un link al correo ingresado para reestablecer su contraseña.
        </span>

        <div className='flex justify-center gap-4'>
          <Button
            onClick={() => router.push('/')}
            className='w-40'
          >
            Volver
          </Button>
          <Button 
            onClick={submiting ? () => {} : onSubmit} 
            className={`w-40 ${submiting ? 'cursor-progress hover:bg-primary' : ''}`}
          >
            {submiting ? 'Cargando...' : 'Enviar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
};

export default Page;