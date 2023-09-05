import { Resolver, SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SampleSchema } from '@/lib/validations/sample';


interface SampleFormProps {
  onSubmit: SubmitHandler<z.infer<typeof SampleSchema>>;
  resolver: Resolver<any>;
  defaultValues: Partial<Record<keyof z.infer<typeof SampleSchema>, any>>;
}

const SampleForm = ({ onSubmit, resolver, defaultValues }: SampleFormProps) => {
  const router = useRouter();
  console.log('DEF VALUES:', defaultValues)
  console.log('resolver:', resolver)

  const form = useForm({
    resolver: resolver,
    defaultValues: defaultValues || {},
  });

  console.log('FORM FORMDATA:', form)

  return (
    <Card className='w-[350px]'>
         <CardHeader>
           <CardTitle>Modificar Muestra</CardTitle>
           <CardDescription>Muestras de Laboratorio</CardDescription>
         </CardHeader>
         <CardContent>
           <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

               <FormField
                 control={form.control}
                 name='code'
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Código de Ingreso</FormLabel>
                     <FormControl>
                       <Input
                         className='bg-gray-200'
                         type='string'
                         placeholder='Ingrese el código...' 
                         {...field} 
                       />
                     </FormControl>
                   </FormItem>
                 )}
               />

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

               <FormField
                 control={form.control}
                 name='inclusion'
                 render={({ field }) => (
                   <FormItem className='flex justify-between m-2'>
                     <FormLabel>Inclusión</FormLabel>
                     <FormControl>
                       <Checkbox 
                         checked={field.value}
                         onCheckedChange={field.onChange}
                       />
                     </FormControl>
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name='semithin'
                 render={({ field }) => (
                   <FormItem className='flex justify-between m-2'>
                     <FormLabel>Semi Fino</FormLabel>
                     <FormControl>
                       <Checkbox 
                         checked={field.value}
                         onCheckedChange={field.onChange}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name='thin'
                 render={({ field }) => (
                   <FormItem className='flex justify-between m-2'>
                     <FormLabel>Fino</FormLabel>
                     <FormControl>
                       <Checkbox 
                         checked={field.value}
                         onCheckedChange={field.onChange}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name='grid'
                 render={({ field }) => (
                   <FormItem className='flex justify-between m-2'>
                     <FormLabel>Grilla</FormLabel>
                     <FormControl>
                       <Checkbox 
                         checked={field.value}
                         onCheckedChange={field.onChange}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <div className='flex justify-center gap-4'>
                 <Button onClick={() => router.back()} type='button' className='w-40'>Volver</Button>
                 <Button type='submit' className='w-40'>Guardar</Button>
               </div>
             </form>
           </Form>
         </CardContent>
       </Card>
  )
}

export default SampleForm;