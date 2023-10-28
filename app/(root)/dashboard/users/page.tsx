'use client'

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import UsersTableHeader from '@/components/shared/UsersTableHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

import { UserInterface } from '@/lib/interfaces/models.interface';
import UserCard from '@/components/cards/UserCard';
import toast from 'react-hot-toast';
import { UserContext } from '../../layout';

const Page = () => {
  const router = useRouter();
  const user = useContext(UserContext);

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
  }, [router])

  if (!user || user.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

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
  
  const deleteUser = async (id: string) => {
    await axios.delete(`/api/users/${id}`)
      .then((response) => {
        toast.success(response.data.message);
        setUsers(users.filter((user) => user._id !== id))
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <div className='mt-16 flex flex-col'>
      <UsersTableHeader />
      <div className='mt-4'>
        {users.map((user) => {
          return (
            <UserCard 
              user={user}
              onClick={onClick}
              key={user._id}
              submiting={submiting}
              deleteUser={deleteUser}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Page;