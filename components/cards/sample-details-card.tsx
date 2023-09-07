import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/information-card';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

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
        <InformationCard>
          {sample.observations}
        </InformationCard>
        <Label>
          Fecha de Creación:
        </Label>
        <InformationCard>
          {createdAtDate.toLocaleDateString()}
        </InformationCard>
        <Label>
          Fecha de Actualización:
        </Label>
        <InformationCard>
          {updatedAtDate.toLocaleDateString()}
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