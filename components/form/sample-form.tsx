import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SampleSchema } from '@/lib/validations/sample';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/shared/loading-spinner';
import { Label } from '@/components/ui/label';

import { UserInterface } from '@/lib/interfaces/models.interface';
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

  const [isLoading, setIsLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);

  const [code, setCode] = useState('');

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const form = useForm({
    resolver: zodResolver(SampleSchema),
    defaultValues: {
      sampleType: '',
      observations: '',
    },
  });

  const selectResearcher = (researcher: UserInterface) => {
    setSelectedResearcher(researcher)

    const first = researcher?.name[0].toUpperCase();
    const last = researcher?.lastname[0].toUpperCase();

    if (first && last) {
      const result = first + last + '-' + researcher.samples.length;

      setCode(result);
    } 
  }

  const onSubmit = async (data: z.infer<typeof SampleSchema>) => {
    setSubmiting(true);
    const { sampleType, observations } = data;

    const payload = {
      code,
      researcher: selectedResearcher?._id,
      sampleType,
      observations,
    }

    await axios.post(`/api/samples/create`, payload)
      .then(() => {
        toast.success('Muestra creada');

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Ocurrió un error');
        setSubmiting(false);
      })
  
  };

  useEffect(() => {
    (async () => {
      await axios.get(`/api/users`)
        .then((response) => {
          setResearchers(response.data.users);
          setIsLoading(false);
        })
        .catch((error) => toast.error(error.message));
    })()
  }, [])

  if (isLoading || !researchers) {
    return <LoadingSpinner />
  }

  return (
    <Card>
      <Toaster />
      <CardHeader>
        <CardTitle>Modificar Muestra</CardTitle>
        <CardDescription>Muestras de Laboratorio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

            <div className='flex flex-col gap-3 mb-3'>
              <Label>
                Investigador:
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-gray-200'
                  >
                    {value ? researchers.find((researcher) => researcher.email === value)?.email : 'Seleccione un investigador...'}
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
                            setValue(currentValue)
                            const auxiliarSelectedResearcher = researchers.find((researcher) => researcher.email === currentValue);
                            selectResearcher(auxiliarSelectedResearcher!);
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === researcher._id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {researcher.email}
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
                type={submiting ? 'button' : 'submit'} 
                className={`w-40 ${submiting ? 'cursor-progress' : ''}`}
              >
                {submiting ? 'Cargando...' : 'Crear'}
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SampleForm;