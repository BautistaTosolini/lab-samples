import { CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/InformationCard';
import formatDateTime from '@/lib/utils/formatDateTime';

import { UserInterface } from '@/lib/interfaces/models.interface';

const ResearcherDetailsCard = ({ researcher }: { researcher: UserInterface }) => {
  const createdAtDate = new Date(researcher.createdAt)

  return (
    <>
      <CardHeader>
        <CardTitle>Detalles del Investigador</CardTitle>
      </CardHeader>
      <>
        <Label>
          Investigador:
        </Label>
        <InformationCard>
          {researcher.name} {researcher.lastname}
        </InformationCard>
        <Label>
          E-Mail:
        </Label>
        <InformationCard>
          {researcher.email}
        </InformationCard>
        <Label>
          Fecha de Registro:
        </Label>
        <InformationCard>
          {formatDateTime(createdAtDate)}
        </InformationCard>

      </>
    </>
  )
}

export default ResearcherDetailsCard;