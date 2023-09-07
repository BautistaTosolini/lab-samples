import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/information-card';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import formatDateTime from '@/lib/utils/formatDateTime';

import { Samples } from '@/lib/interfaces/models.interface';

interface SampleDetailsCardProps {
  sample: Samples;
  form: UseFormReturn<{ inclusion: boolean; semithin: boolean; thin: boolean; grid: boolean; }, any, undefined>;
}

const SampleDetailsCard = ({ sample, form }: SampleDetailsCardProps) => {
  const router = useRouter();
  const createdAtDate = new Date(sample.createdAt)
  const updatedAtDate = new Date(sample.updatedAt)

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
        <Label>
          Observaciones:
        </Label>
        <div className='min-h-[40px] flex w-full rounded-md border bg-gray-200 px-3 py-2 text-sm my-2'>
          {sample.observations ? sample.observations : 'Sin observaciones.'}
        </div>
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

      </>
    </>
  )
}

export default SampleDetailsCard;