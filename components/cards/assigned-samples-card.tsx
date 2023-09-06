import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_BASE } from '@/constants';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/shared/loading-spinner';

import { UserInterface } from '@/lib/interfaces/models.interface';
import { Label } from '@/components/ui/label';
import AssignSampleCard from './assign-sample-card';

const AssignedSamplesCard = ({ id }: { id: string }) => {
  const [assignedUsers, setAssignedUsers] = useState<UserInterface[] | null>(null);
  const [unassignedUsers, setUnassignedUsers] = useState<UserInterface[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //opens and closes the user details card
  const handleUserClick = (user: UserInterface) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  //fetch all the assigned users and 25 unassigned users
  useEffect(() => {
    (async () => {
      await axios.get(`${API_BASE}/api/users/${id}`)
        .then((response) => {
          setAssignedUsers(response.data.assignedUsers);
          setUnassignedUsers(response.data.unassignedUsers);
          setIsLoading(false);
        })
        .catch((error) => toast.error(error.message));
    })()
  }, [id])

  const onSubmit = async () => {
    const payload = {
      assignUserId: selectedUser?._id,
      sampleId: id,
    }

    await axios.post(`${API_BASE}/api/samples/assign`, payload)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <>

      {isModalOpen && selectedUser && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-md'>
            <AssignSampleCard 
              user={selectedUser}
              sampleId={id}
              onClick={closeModal}
              onSubmit={onSubmit}
            />
        </div>
      )}

      <Card>
        <Toaster />
        <CardHeader>
          <CardTitle>Asignación</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-1'>
          <Label>Usuarios asignados:</Label>
          <div className='flex h-64 w-full flex-col rounded-md border bg-gray-200 text-sm my-2 overflow-y-auto gap-2 py-1'>
            {assignedUsers?.map((user) => {
              return (
                <div
                key={user._id}
                className='flex flex-col cursor-pointer hover:bg-gray-400 rounded-sm w-full px-2'
                onClick={() => handleUserClick(user)}
                >
                  {user.email} - {user.name}
                  <Separator className='bg-gray-400' />
                </div>
              )
            })}
          </div>
          <Label>Usuarios sin asignar:</Label>
          <div className='flex h-64 w-full flex-col rounded-md border bg-gray-200 text-sm mb-2 overflow-y-auto gap-2 py-1'>
            {unassignedUsers?.map((user) => {
              return (
                <div
                key={user._id}
                className='flex flex-col cursor-pointer hover:bg-gray-400 rounded-sm w-full px-2'
                onClick={() => handleUserClick(user)}
                >
                  {user.email} - {user.name}
                  <Separator className='bg-gray-400' />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>

  )
}

export default AssignedSamplesCard;