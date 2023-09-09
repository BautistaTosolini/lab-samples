import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { UserInterface } from '@/lib/interfaces/models.interface';

const Navbar = ({ user }: { user: UserInterface }) => {
  const router = useRouter();

  const onClick = async () => {
    await axios.get(`/api/auth/logout`)

    router.push('/')
  };

  return (
    <nav className='bg-primary fixed w-full h-12 flex flex-row items-center justify-between px-10 drop-shadow-2xl'>
      <h2 className='text-lg font-bold text-white'>
        Muestras de Laboratorio
      </h2>
      <div className='flex gap-6'>
        {user.role !== 'researcher' ?
        <Button 
          variant='outline'
          className='w-56 bg-primary text-white hover:text-black'
          onClick={() => router.push('/dashboard/create')}
        >
          Agregar Muestra
        </Button>
        : null}
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant='outline'
            className='w-56 bg-primary text-white hover:text-black'
          >
            {user.name} {user.lastname}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className='cursor-pointer hover:bg-gray-300'
            onClick={onClick}
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar;
