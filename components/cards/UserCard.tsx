'use client'

import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import axios from 'axios';
import { ChevronsUpDown } from 'lucide-react';

import { UserInterface } from '@/lib/interfaces/models.interface';
import toast from 'react-hot-toast';

interface UserCardProps {
  user: UserInterface;
  onClick: (userId: string, value: string) => void;
  submiting: boolean;
}

const UserCard = ({ user, onClick, submiting }: UserCardProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(user.role);

  const roles = [
    'researcher',
    'secretary',
  ]

  return (
    <div className='flex flex-col justify-between'>
      <div 
        className='flex bg-white rounded-lg p-3 border border-gray-300 mb-2'
        onClick={() => {}}
        key={user._id}
      >
        <div className='flex gap-4 text-center items-center'>
          <span className='font-semibold w-40 truncate'>
            {user.name}
          </span>
          <span className='font-semibold w-40 truncate'>
            {user.lastname}
          </span>
          <span className='font-semibold w-72 truncate'>
            {user.email}
          </span>

          <span className='font-semibold w-56'>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}aria-atomic
                  className='w-[200px] justify-between font-semibold'
                >
                  {value ? (value === 'researcher' ? 'Investigador' : 'Secretaria') : (user.role === 'researcher' ? 'Investigador' : 'Secretaria')}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandGroup>
                    {roles.map((rol) => {
                      return (
                        <CommandItem
                          key={rol}
                          onSelect={(rol) => {
                            if (rol === 'investigador') {
                              setValue('researcher');
                            } else {
                              setValue('secretary')
                            }
                            setOpen(false)
                          }}
                        >
                          {rol === 'researcher' ? 'Investigador' : 'Secretaria'}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </span>

        </div>
      </div>
      {user.role !== value ? 
      <div className='h-full flex justify-end mr-4 gap-4 mb-2'>
        <Button
          className='h-8'
          onClick={() => setValue(user.role)}
        >
          Cancelar
        </Button>
        <Button 
          className={`h-8 ${submiting ? 'cursor-progress' : ''}`}
          onClick={() => onClick(user._id, value)}
        >
          {submiting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
      : null}
    </div>
  )
}

export default UserCard;