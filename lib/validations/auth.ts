import * as z from 'zod';

export const RegisterSchema = z.object({
  name: z.string().nonempty({ message: 'Nombre no puede ser vacío' }),
  lastname: z.string().nonempty({ message: 'Apellido no puede ser vacío' }),
  email: z.string().nonempty({ message: 'E-Mail no puede ser vacío' }),
  password: z.string().nonempty({ message: 'Contraseña no puede ser vacía' }).refine((value) => value.length >= 8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  confirmPassword: z.string().nonempty({ message: 'Contraseña no puede ser vacía' }),
  id: z.string().nonempty({ message: 'DNI no puede ser vacía' }),
})

export const LoginSchema = z.object({
  email: z.string().nonempty({ message: 'E-Mail no puede ser vacío' }),
  password: z.string().nonempty({ message: 'Contraseña no puede ser vacía' }),
})