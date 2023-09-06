import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_BASE } from '@/constants';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/shared/loading-spinner';

import { UserInterface } from '@/lib/interfaces/models.interface';
import { Label } from '@/components/ui/label';

const AssignedSamplesCard = () => {
  const [users, setUsers] = useState<UserInterface[] | null>(null);

  useEffect(() => {
    (async () => {
      await axios.get(`${API_BASE}/api/users`)
        .then((response) => setUsers(response.data.users))
        .catch((error) => toast.error(error.message));
    })()
  }, [])

  if (!users) {
    return <LoadingSpinner />
  }

  return (
    <Card>
      <Toaster />
      <CardHeader>
        <CardTitle>Asignación</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <Label>Usuarios asignados:</Label>
        <div className='flex h-64 w-full flex-col rounded-md border bg-gray-200 text-sm mb-2 overflow-y-auto gap-2 py-1'>
          {users?.map((user) => {
            return (
              <div
              key={user._id}
              className='flex flex-col cursor-pointer hover:bg-gray-500 rounded-sm w-full px-2'
              >
                {user.email} - {user.name}
                <Separator className='bg-gray-400' />
              </div>
            )
          })}
        </div>
        <Label>Usuarios sin asignar:</Label>
        <div className='flex h-64 w-full flex-col rounded-md border bg-gray-200 text-sm mb-2 overflow-y-auto gap-2 py-1'>
          {users?.map((user) => {
            return (
              <div
              key={user._id}
              className='flex flex-col cursor-pointer hover:bg-gray-500 rounded-sm w-full px-2'
              >
                {user.email} - {user.name}
                <Separator className='bg-gray-400' />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignedSamplesCard;