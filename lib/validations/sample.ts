import * as z from 'zod';

export const SampleSchema = z.object({
  code: z.string().nonempty({ message: 'Código no puede ser vacío' }),
  sampleType: z.string().nonempty({ message: 'Tipo de muestra no puede ser vacío' }),
  observations: z.string().optional(),
  inclusion: z.boolean(),
  semithin: z.boolean(),
  thin: z.boolean(),
  grid: z.boolean(),
})