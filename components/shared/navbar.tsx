import { Button } from '@/components/ui/button';

import { UserInterface } from '@/lib/interfaces/models.interface';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

const Navbar = ({ onClick }: { onClick: () => void; }) => {
  return (
    <nav className='bg-gray-400 fixed w-full h-12 flex flex-row items-center justify-between px-10'>
      <h2 className='text-lg font-bold'>
        Muestras de Laboratorio
      </h2>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>Mi Cuenta</Button>
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
    </nav>
  )
}

export default Navbar;