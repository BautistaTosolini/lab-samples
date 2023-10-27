import * as z from 'zod';

export const SampleSchema = z.object({
  sampleType: z.string().nonempty({ message: 'Tipo de muestra no puede ser vacío' }),
  observations: z.string().optional(),
})

export const UpdateSampleSchema = z.object({
  observations: z.string().optional(),
  inclusion: z.boolean(),
  semithin: z.boolean(),
  thin: z.boolean(),
  grid: z.boolean(),
  finished: z.boolean(),
})
