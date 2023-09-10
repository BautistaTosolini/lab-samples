'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import UsersTableHeader from '@/components/shared/UsersTableHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

import { UserInterface } from '@/lib/interfaces/models.interface';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import UserCard from '@/components/cards/UserCard';
import toast, { Toaster } from 'react-hot-toast';

const Page = () => {
  const router = useRouter();

  const [users, setUsers] = useState<UserInterface[] | null>(null);
  const [submiting, setSubmiting] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      await axios.get(`/api/users/list`)
        .then((response) => {
          const users = response.data.users;

          setUsers(users);
        })
        .catch(() => {
          router.push('/dashboard');
        })
    }

    fetchAllUsers();
  }, [])

  const onClick = async (userId: string, value: string) => {
    setSubmiting(true);

    const payload = {
      updateUserId: userId,
      role: value,
    }

    await axios.post(`/api/users/role`, payload)
      .then((response) => {
        const users = response.data.users;
        
        setUsers(users);
        setSubmiting(false);

        toast.success('Usuario actualizado');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setSubmiting(false);
      })
  }

if (!users) {
  return <LoadingSpinner />
}

  return (
    <div className='mt-16 flex flex-col'>
      <Toaster />
      <UsersTableHeader />
      <div className='mt-4'>
        {users.map((user) => {
          return (
            <UserCard 
              user={user}
              key={user._id}
              onClick={onClick}
              submiting={submiting}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Page;