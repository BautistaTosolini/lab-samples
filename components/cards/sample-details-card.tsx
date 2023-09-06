import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InformationCard from '@/components/cards/information-card';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';

interface SampleDetailsCardsProps {
  author: UserInterface;
  sample: Samples;
}

const SampleDetailsCards = ({ author, sample }: SampleDetailsCardsProps) => {
  const createdAtDate = new Date(sample.createdAt)
  const updatedAtDate = new Date(sample.updatedAt)

  return (
    <Card className='w-full'>
      <CardHeader className='w-full'>
        <CardTitle>Detalles de la Muestra</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>
          Investigador:
        </Label>
        <InformationCard>
          {author.name}
        </InformationCard>
        <Label>
          E-Mail:
        </Label>
        <InformationCard>
          {author.email}
        </InformationCard>
        <Label>
          Fecha de Creación:
        </Label>
        <InformationCard>
          {createdAtDate.toLocaleDateString()}
        </InformationCard>
        <Label>
          Fecha de Actualización:
        </Label>
        <InformationCard>
          {updatedAtDate.toLocaleDateString()}
        </InformationCard>
      </CardContent>
    </Card>
  )
}

export default SampleDetailsCards;