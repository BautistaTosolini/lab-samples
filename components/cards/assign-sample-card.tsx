import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/information-card';
import { Button } from '@/components/ui/button';

import { UserInterface } from '@/lib/interfaces/models.interface';

interface AssignSampleCardProps {
  user: UserInterface,
  sampleId: string;
  onClick: () => void;
  onSubmit: () => void;
}

const AssignSampleCard = ({ user, sampleId, onClick, onSubmit }: AssignSampleCardProps) => {
  const createdAtDate = new Date(user.createdAt)
  const isAssigned = user.samples.includes(sampleId as any);

  console.log(user)

  const buttonText = isAssigned ? 'Desasignar' : 'Asignar';

  return (
    <Card className='w-[400px]'>
      <CardHeader>
        <CardTitle>Detalles del Usuario:</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>
          Nombre:
        </Label>
        <InformationCard>
          {user.name}
        </InformationCard>
        <Label>
          E-Mail:
        </Label>
        <InformationCard>
          {user.email}
        </InformationCard>
        <Label>
          Fecha de Creación:
        </Label>
        <InformationCard>
          {createdAtDate.toLocaleDateString()}
        </InformationCard>
        <div className='flex justify-center gap-4 mt-4'>
          <Button
            onClick={onClick}
            className='w-40'
          >
            Volver
          </Button>
          <Button
            onClick={onSubmit}
            className='w-40'
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignSampleCard;