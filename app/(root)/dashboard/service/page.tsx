'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ServiceInterface } from '@/lib/interfaces/models.interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import InformationCard from '@/components/cards/InformationCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

const Page = () => {
  const [services, setServices] = useState<ServiceInterface[] | undefined>(undefined);
  const [updatedPrices, setUpdatedPrices] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getServices = async () => {
      await axios.get('/api/service')
        .then((response) => {
          const services = response.data.services;
          setServices(services);
          setUpdatedPrices(services.map((service: ServiceInterface) => service.price));
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          router.push('/dashboard');
        })
    }

    getServices();
  }, [])

  const handleUpdatePrice = async (index: number) => {
    await axios.put('/api/service', { code: index, price: updatedPrices[index]})
      .then(() => {
        toast.success('Muestra actualizada');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setUpdatedPrices(services?.map((service) => service.price) || []);
  };

  if (!services) {
    return <LoadingSpinner />;
  }

  return (
    <div className='m-4 mt-16'>
      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
          <CardDescription>Muestras de Laboratorio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='gap-2 flex flex-col'>
            {services.map((service, index) => (
              <div key={service.code}>
                <InformationCard>{service.name}</InformationCard>
                <div className='flex flex-row items-center gap-4'>
                  <InformationCard>$ {updatedPrices[index]}</InformationCard>
                  <AlertDialog>
                    <AlertDialogTrigger className='w-full gap-0 m-0 p-0'>
                      <Button onClick={() => setIsUpdating(true)}>Actualizar</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Actualizar precio</AlertDialogTitle>
                        <AlertDialogDescription>{service.name}</AlertDialogDescription>
                        <Input
                          value={updatedPrices[index]}
                          onChange={(e) => {
                            const newPrices = [...updatedPrices];
                            newPrices[index] = parseInt(e.target.value) || 0;
                            setUpdatedPrices(newPrices);
                          }}
                        />
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelUpdate}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleUpdatePrice(index)}>
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-center gap-4'>
            <Button
              type='button'
              className='w-40'
              onClick={() => router.push('/dashboard')}
            >
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
