'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/InformationCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import formatDateTime from '@/lib/utils/formatDateTime';

import { UserInterface } from '@/lib/interfaces/models.interface';

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const [canEditEmail, setCanEditEmail] = useState(false);
  const [canEditPassword, setCanEditPassword] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      await axios.get(`/api/auth/authenticate`)
        .then((response) => {
          const user = response.data.user;

          setUser(user);
          setIsLoading(false);
          setEmail(user.email);
        })
        .catch((error) => {
          router.push('/dashboard');
        })
    }

    fetchUserInfo();
  }, [])

  const onSubmit = async () => {
    setSubmiting(true);

    await axios.post('/api/users/update', { email })
      .then((response) => {
        const user = response.data.user;

        setUser(user);

        setPassword('');
        setConfirmPassword('');

        setCanEditEmail(false);
        setCanEditPassword(false);

        toast.success('Usuario actualizado');

        setSubmiting(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);

        setSubmiting(false);
      })
  }

  if (isLoading || !user) {
    return (
      <LoadingSpinner />
    )
  }

  const canSubmit = (email !== user.email && canEditEmail && password === confirmPassword) || (password === confirmPassword && password.length > 0 && canEditPassword)

  const buttonClassnames = `w-40 ${submiting ? 'cursor-progress bg-gray-500 text-white hover:bg-gray-500' : ''} ${canSubmit ? '' : 'bg-gray-500 text-white cursor-not-allowed hover:bg-gray-500'}`
  const createdAtDate = new Date(user!.createdAt);

  return (
    <>
      <div className='justify-center items-center mt-16'>
        <Card className='w-[350px] sm:w-[450px]'>
          <Toaster />
          <CardHeader>
            <CardTitle>Configuración de Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>
              Nombre:
            </Label>
            <InformationCard>
              {user.name}
            </InformationCard>
            <Label>
              Apellido:
            </Label>
            <InformationCard>
              {user.lastname}
            </InformationCard>
            <Label>
              Fecha de Creación:
            </Label>
            <InformationCard>
              {formatDateTime(createdAtDate)}
            </InformationCard>
            <Label>
              E-Mail:
            </Label>
            <div className='flex gap-4'>
              <Input
                className='bg-gray-200'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!canEditEmail}
                type='email'
              />
              <Button
                onClick={() => setCanEditEmail(!canEditEmail)}
              >
                Editar
              </Button>
            </div>

            <Label>
              Contraseña:
            </Label>
            <div className='flex gap-4'>
              <Input
                className='bg-gray-200'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!canEditPassword}
                type='password'
                placeholder='••••••••••••'
              />
              <Button
                onClick={() => setCanEditPassword(!canEditPassword)}
              >
                Editar
              </Button>
            </div>

            {canEditPassword ?
            <>
              <Label>
                Confirmar Contraseña:
              </Label>
              <Input
              className='bg-gray-200 w-[310px]'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type='password'
              placeholder='••••••••••••'
              />
            </>
          : null}
            
            <div className='flex justify-center gap-4 mt-4'>
              <Button 
                onClick={() => router.push('/dashboard')}
                type='button' 
                className='w-40'
              >
                Volver
              </Button>
              <Button 
                type={submiting ? 'button' : 'submit'} 
                className={buttonClassnames}
                onClick={canSubmit || submiting ? onSubmit : () => {}}
              >
                {submiting ? 'Cargando...' : 'Guardar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
export default Page;