import * as z from 'zod';

export const SampleSchema = z.object({
  sampleType: z.string().nonempty({ message: 'Tipo de muestra no puede ser vacío' }),
  observations: z.string().optional(),
})

export const UpdateSampleSchema = z.object({
  observations: z.string().optional(),
  inclusion: z.boolean().optional(),
  semithin: z.boolean().optional(),
  thin: z.boolean().optional(),
  grid: z.boolean().optional(),
  staining: z.boolean().optional(),
  finished: z.boolean(),
})
