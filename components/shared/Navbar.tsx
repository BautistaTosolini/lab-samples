'use client'

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { File, FileBarChart2, Home, LogOut, Menu, Plus, Settings, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { UserInterface } from '@/lib/interfaces/models.interface';

const Navbar = ({ user }: { user: UserInterface }) => {
  const router = useRouter();
  const [userIsMobile, setUserIsMobile] = useState(false);

  const onClick = async () => {
    await axios.get(`/api/auth/logout`)

    router.push('/')
  };

  useEffect(() => {
    const handleResize = () => {
      setUserIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className='bg-primary fixed w-full h-12 flex flex-row items-center justify-end px-14 sm:justify-between drop-shadow-2xl'>
      <h2 
        className='text-lg font-bold text-white cursor-pointer hidden sm:flex'
        onClick={() => router.push('/dashboard')}
      >
        Muestras de Laboratorio
      </h2>
      <div className='flex gap-6'>
        <DropdownMenu>

          {userIsMobile ?
          <DropdownMenuTrigger asChild className='flex sm:hidden'>
              <Menu className='h-6 w-6 text-white cursor-pointer' />
          </DropdownMenuTrigger>

          :
          
          <DropdownMenuTrigger asChild className='hidden sm:flex'>
            <Button 
              variant='outline' 
              className='w-36 bg-primary text-white hover:text-black'
              >
              Menu
            </Button>
          </DropdownMenuTrigger>
            }

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
              <>
                <DropdownMenuItem 
                  className='cursor-pointer hover:bg-gray-300'
                  onClick={() => router.push('/dashboard/service')}
                >
                  <FileBarChart2 className='mr-2 h-4 w-4' />
                  <span>Servicios</span>
                </DropdownMenuItem>
              
                <DropdownMenuItem 
                  className='cursor-pointer hover:bg-gray-300'
                  onClick={() => router.push('/dashboard/print')}
                >
                  <File className='mr-2 h-4 w-4' />
                  <span>Imprimir Muestras</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className='cursor-pointer hover:bg-gray-300'
                  onClick={() => router.push('/dashboard/create')}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  <span>Agregar Muestra</span>
                </DropdownMenuItem>
              </>
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
