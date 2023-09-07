import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/information-card';
import { Button } from '@/components/ui/button';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';

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
          {createdAtDate.toLocaleDateString()}
        </InformationCard>

      </>
    </>
  )
}

export default ResearcherDetailsCard;