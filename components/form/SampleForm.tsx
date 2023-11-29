import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SampleSchema } from '@/lib/validations/sample';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Label } from '@/components/ui/label';

import { ServiceInterface, UserInterface } from '@/lib/interfaces/models.interface';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { cn } from '@/lib/utils';

interface SampleFormProps {
  onClick: () => void;
  userInfo: UserInterface | null;
}

const SampleForm = ({ onClick, userInfo }: SampleFormProps) => {
  const router = useRouter();
  const [researchers, setResearchers] = useState<UserInterface[] | null>(null);
  const [selectedResearcher, setSelectedResearcher] = useState<UserInterface | null>(null);
  const [services, setServices] = useState<ServiceInterface[] | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceInterface | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState('');

  const [researcherOpen, setResearcherOpen] = useState(false);
  const [researcherValue, setResearcherValue] = useState('');

  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceValue, setServiceValue] = useState('');

  const form = useForm({
    resolver: zodResolver(SampleSchema),
    defaultValues: {
      sampleType: '',
      observations: '',
    },
  });

  useEffect(() => {
    const getResearchers = async () => {
      await axios.get(`/api/users`)
        .then((response) => {
          setResearchers(response.data.users);
          setIsLoading(false);
        })
        .catch((error) => toast.error(error.message));
    };

    const getServices = async () => {
      await axios.get('/api/service')
        .then((response) => {
          setServices(response.data.services);
          setIsLoading(false);
        })
    }

    getResearchers();
    getServices();
  }, []);

  const selectResearcher = (researcher: UserInterface) => {
    setSelectedResearcher(researcher);

    const first = researcher?.name[0].toUpperCase();
    const last = researcher?.lastname[0].toUpperCase();
    const id = researcher?.id;

    if (first && last) {
      const result = first + last + id.toString().slice(-3) + '-' + researcher.samplesCount;

      setCode(result);
    }
  }

  const transformSelectedService = (serviceName: string) => {
    const serviceMap: { [key: string]: string } = {
      'procesamiento completo': 'Procesamiento Completo',
      'procesamiento parcial (hasta semi-fino)': 'Procesamiento Parcial (hasta Semi-Fino)',
      'tinción negativa (nano)': 'Tinción Negativa (Nano)',
      'tinción negativa (vesículas)': 'Tinción Negativa (Vesículas)',
      'tinción negativa (bacterias)': 'Tinción Negativa (Bacterias)',
    };

    return serviceMap[serviceName] || '';
  };

  const researcherDisplayName = selectedResearcher
    ? `${selectedResearcher.name} ${selectedResearcher.lastname} - ${selectedResearcher.id}`
    : 'Seleccione un investigador...';

  const transformedServiceValue = transformSelectedService(serviceValue);

  const onSubmit = async (data: z.infer<typeof SampleSchema>) => {
    setSubmitting(true);
    const { sampleType, observations } = data;

    const payload = {
      code,
      researcher: selectedResearcher?._id,
      serviceCode: selectedService?.code,
      sampleType,
      observations,
    }

    await axios.post(`/api/samples`, payload)
      .then(() => {
        toast.success('Muestra creada');

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Ocurrió un error');
        setSubmitting(false);
      })
  };

  if (isLoading || !researchers || !services) {
    return <LoadingSpinner />
  }

  return (
    <Card className='w-[400px]'>
      <CardHeader>
        <CardTitle>Agregar Muestra</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

            <div className='flex flex-col gap-3 mb-3'>
              <Label>
                Investigador
              </Label>
              <Popover open={researcherOpen} onOpenChange={setResearcherOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={researcherOpen}
                    className='w-full justify-between bg-gray-200'
                  >
                    {researcherDisplayName}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                  <Command>
                    <CommandInput placeholder='Buscar investigador...' />
                    <CommandEmpty>Ningún investigador encontrado.</CommandEmpty>
                    <CommandGroup>
                      {researchers.map((researcher) => (
                        <CommandItem
                          key={researcher._id}
                          onSelect={(currentValue) => {
                            setResearcherValue(currentValue)
                            const auxiliarSelectedResearcher = researchers.find((researcher) => `${researcher.name.toLowerCase()} ${researcher.lastname.toLowerCase()} - ${researcher.id}` === currentValue);
                            selectResearcher(auxiliarSelectedResearcher!);
                            setResearcherOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              researcherValue === researcher._id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {`${researcher.name} ${researcher.lastname} - ${researcher.id}`}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Label>
              Código de Muestra
            </Label>
            <div className={`flex h-10 w-full rounded-md border bg-gray-200 px-3 py-2 text-sm my-2 ${code.length > 0 ? 'text-black' : 'text-gray-500'}`}>
              {code.length > 0 ? `${code}` : ''}
            </div>

            <div className='gap-3 flex flex-col'>
              <Label>
                Servicio
              </Label>
              <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={serviceOpen}
                    className='w-full justify-between bg-gray-200'
                  >
                    {serviceValue ? serviceValue : 'Seleccione un servicio...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                  <Command>
                    <CommandInput placeholder='Buscar un servicio...' />
                    <CommandEmpty>Ningún servicio encontrado.</CommandEmpty>
                    <CommandGroup>
                      {services.map((service) => (
                        <CommandItem
                          key={service.code}
                          onSelect={(currentValue) => {
                            const transformedValue = transformSelectedService(currentValue);
                            setServiceValue(transformedValue)
                            const auxService = services.find((service) => service.name === transformedValue)
                            setSelectedService(auxService!)
                            setServiceOpen(false)
                          }}
                        >
                          {service.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className='mt-2'>
              <Label>
                Precio del Servicio
              </Label>
              <div className={`flex h-10 w-full rounded-md border bg-gray-200 px-3 py-2 text-sm my-2 ${selectedService ? 'text-black' : 'text-gray-500'}`}>
                {selectedService ? `$ ${selectedService.price}` : ''}
              </div>
            </div>

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
                  <FormMessage />
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

            <div className='flex justify-center gap-4'>
              <Button 
                onClick={onClick}
                type='button' 
                className='w-40'
              >
                Volver
              </Button>
              <Button 
                type={submitting ? 'button' : 'submit'} 
                className={`w-40 ${submitting ? 'cursor-progress' : ''}`}
              >
                {submitting ? 'Cargando...' : 'Crear'}
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SampleForm;
