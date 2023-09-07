import * as z from 'zod';

export const RegisterSchema = z.object({
  name: z.string().nonempty({ message: 'Nombre no puede ser vacío' }),
  lastname: z.string().nonempty({ message: 'Apellido no puede ser vacío' }),
  email: z.string().nonempty({ message: 'E-Mail no puede ser vacío' }),
  password: z.string().nonempty({ message: 'Contraseña no puede ser vacía' }),
  confirmPassword: z.string().nonempty({ message: 'Contraseña no puede ser vacía' }),
})

export const LoginSchema = z.object({
  email: z.string().nonempty({ message: 'E-Mail no puede ser vacío' }),
  password: z.string().nonempty({ message: 'Contraseña no puede ser vacía' }),
})