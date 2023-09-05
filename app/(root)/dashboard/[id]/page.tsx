'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, Form, FormMessage } from '@/components/ui/form';
import { SampleSchema } from '@/lib/validations/sample';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { API_BASE } from '@/constants';
import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import LoadingSpinner from '@/components/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SampleForm from '@/components/sample-form';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [sample, setSample] = useState<Samples | null>(null);
  const [author, setAuthor] = useState<UserInterface | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    code: '',
    sampleType: '',
    observations: '',
    inclusion: false,
    semithin: false,
    thin: false,
    grid: false,
  });

  const resolver = zodResolver(SampleSchema);

  //update the form when the sample came from the backend
  useEffect(() => {
    if (sample) {
      setDefaultValues({
      code: sample.code,
      sampleType: sample.sampleType,
      observations: sample.observations,
      inclusion: sample.inclusion,
      semithin: sample.semithin,
      thin: sample.thin,
      grid: sample.grid,
    });

      setIsFormReady(true);
      
    }
  }, [sample]);

  const onSubmit = (data: z.infer<typeof SampleSchema>) => {
    console.log(data)
  }

  //get the sample and author information
  useEffect(() => {
    (async () => {
      await axios.get(`${API_BASE}/api/samples/${params.id}`)
        .then((response) => {
          setSample(response.data.sample)
          setAuthor(response.data.sample.author)
        })
        .catch((error) => toast.error(error.message));
    })()
  }, [router, params.id])

  if (!author || !sample || !isFormReady) {
    return <LoadingSpinner />
  }

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Muestra</TabsTrigger>
        <TabsTrigger value="password">Detalles</TabsTrigger>
        <TabsTrigger value="assigned">Asignados</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <SampleForm 
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={resolver}
        />
      </TabsContent>

      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="assigned">Change your password here.</TabsContent>
    </Tabs>
  )
}

export default Page