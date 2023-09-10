import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Home, LogOut, Plus, Settings, Users } from 'lucide-react';

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
    <nav className='bg-primary fixed w-full h-12 flex flex-row items-center justify-between px-14 drop-shadow-2xl'>
      <h2 
        className='text-lg font-bold text-white cursor-pointer'
        onClick={() => router.push('/dashboard')}
      >
        Muestras de Laboratorio
      </h2>
      <div className='flex gap-6'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant='outline'
              className='w-36 bg-primary text-white hover:text-black'
            >
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel className='pb-0'>Menu</DropdownMenuLabel>
            <span className='text-xs ml-2 font-semibold'>{user.name} {user.lastname}</span>

            <DropdownMenuItem 
              className='cursor-pointer hover:bg-gray-300'
              onClick={() => router.push('/dashboard')}
            >
              <Home className='mr-2 h-4 w-4' />
              <span>Muestras</span>
            </DropdownMenuItem>

            {user.role !== 'researcher' ?
              <DropdownMenuItem 
              className='cursor-pointer hover:bg-gray-300'
              onClick={() => router.push('/dashboard/create')}
              >
                <Plus className='mr-2 h-4 w-4' />
                <span>Agregar Muestra</span>
              </DropdownMenuItem>
            : null}

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>

            <DropdownMenuItem 
              className='cursor-pointer hover:bg-gray-300'
              onClick={() => router.push('/dashboard/config')}
            >
              <Settings className='mr-2 h-4 w-4' />
              <span>Configuración</span>
            </DropdownMenuItem>

            {user.role === 'admin' ?
              <DropdownMenuItem 
              className='cursor-pointer hover:bg-gray-300'
              onClick={() => router.push('/dashboard/users')}
              >
                <Users className='mr-2 h-4 w-4' />
                <span>Usuarios</span>
              </DropdownMenuItem>
            : null}

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
