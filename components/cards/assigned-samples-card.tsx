import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_BASE } from '@/constants';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/shared/loading-spinner';

import { UserInterface } from '@/lib/interfaces/models.interface';

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
        <CardTitle>Asignados de la Muestra</CardTitle>
      </CardHeader>
      <CardContent>
      <div className='flex h-80 w-full flex-col rounded-md border bg-gray-200 px-3 py-2 text-sm my-2 overflow-y-auto gap-2'>
        {users?.map((user) => {
          return (
            <div
            key={user._id}
            className='flex flex-col'
            >
              {user.email}
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