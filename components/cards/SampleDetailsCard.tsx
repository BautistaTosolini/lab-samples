import { UseFormReturn } from 'react-hook-form';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/InformationCard';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import formatDateTime from '@/lib/utils/formatDateTime';
import { Textarea } from '@/components/ui/textarea';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';
import { CheckSquare, Square } from 'lucide-react';

interface SampleDetailsCardProps {
  sample: Samples;
  form: UseFormReturn<{ observations: string; inclusion: boolean; semithin: boolean; thin: boolean; grid: boolean; finished: boolean; }, any, undefined>;
  user: UserInterface;
}

const SampleDetailsCard = ({ sample, form, user }: SampleDetailsCardProps) => {
  const createdAtDate = new Date(sample.createdAt)
  const updatedAtDate = new Date(sample.updatedAt)

  console.log(sample)
  console.log(form)

  return (
    <>
      <CardHeader className='w-full'>
        <CardTitle>Detalles de la Muestra</CardTitle>
      </CardHeader>
      <>
        <Label>
          Código de Muestra:
        </Label>
        <InformationCard>
          {sample.code}
        </InformationCard>
        <Label>
          Tipo de Muestra:
        </Label>
        <InformationCard>
          {sample.sampleType}
        </InformationCard>
        {user.role !== 'researcher' ?
          <>
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
          </>
        : 
          <>
            <Label>
              Observaciones:
            </Label>
            <div className='min-h-[40px] flex w-full rounded-md border bg-gray-200 px-3 py-2 text-sm my-2'>
              {sample.observations ? sample.observations : 'Sin observaciones.'}
            </div>
          </>
        }
        
        <Label>
          Fecha de Creación:
        </Label>
        <InformationCard>
          {formatDateTime(createdAtDate)}
        </InformationCard>
        <Label>
          Fecha de Actualización:
        </Label>
        <InformationCard>
          {formatDateTime(updatedAtDate)}
        </InformationCard>

    	  {user.role !== 'researcher' ?
          <>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='finished'
              render={({ field }) => (
                <FormItem className='flex justify-between m-2'>
                  <FormLabel>Finalizado</FormLabel>
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        :
          <div className='flex flex-col gap-2 font-semibold'>
            <div className='flex justify-between'>
              Inclusión:
              {sample.inclusion ? <CheckSquare /> : <Square />}
            </div>
            <div className='flex justify-between'>
              Semi Fino:
              {sample.semithin ? <CheckSquare /> : <Square />}
            </div>
            <div className='flex justify-between'>
              Fino:
              {sample.thin ? <CheckSquare /> : <Square />} 
            </div>
            <div className='flex justify-between'>
              Grilla:
              {sample.grid ? <CheckSquare /> : <Square />}
            </div>
            <div className='flex justify-between'>
              Finalizado:
              {sample.finished ? <CheckSquare /> : <Square />}
            </div>
          </div>
        } 

      </>
    </>
  )
}

export default SampleDetailsCard;