'use client'

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Page = () => {
  const router = useRouter();

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Mail de Recuperación</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent className='gap-4 flex flex-col'>
        <Label>
          Se ha enviado un link de recuperación a su E-Mail, acceda a él para reestablecer su contraseña.
        </Label>

        <div className='flex justify-center gap-4'>
          <Button
            onClick={() => router.push('/')}
            className='w-40'
          >
            Volver
          </Button>
        </div>
      </CardContent>
    </Card>
  )
};

export default Page;