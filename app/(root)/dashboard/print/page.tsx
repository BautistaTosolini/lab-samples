'use client'

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import generatePDF from 'react-to-pdf';
import toast from 'react-hot-toast';
import { es } from 'date-fns/locale';

import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SampleCard from '@/components/cards/SampleCard';
import { verifyMonthDifference } from '@/lib/utils/verifyMonthDifference';
import TableHeader from '@/components/shared/TableHeader';
import formatDateTime from '@/lib/utils/formatDateTime';

import { Samples, UserInterface } from '@/lib/interfaces/models.interface';

const Page = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  const [finalDate, setFinalDate] = useState<Date | undefined>(undefined);

  const [selectedInitialDate, setSelectedInitialDate] = useState<Date | undefined>(undefined);
  const [selectedFinalDate, setSelectedFinalDate] = useState<Date | undefined>(undefined);

  const [searched, setSearched] = useState(false);
  const [samples, setSamples] = useState<Samples[] | null>(null);
  const [serviceType, setServiceType] = useState<'processing' | 'staining'>('processing');

  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      await axios.get('/api/auth/authenticate')
        .then((response) => {
          const user = response.data.user;

          if (!user || user.role === 'researcher') {
            router.push('/dashboard');
            return;
          }

          setUserInfo(user);
          setIsLoading(false);
        })
        .catch((error) => {
          router.push('/dashboard')
        })
    }

    authenticateUser();
  }, [router])

  const handleSearch = async () => {
    setSubmiting(true);
    
    if (!initialDate || !finalDate) {
      setSubmiting(false);
      return toast.error('Seleccione una fecha válida');
    }

    if (verifyMonthDifference(initialDate, finalDate)) {
      setSubmiting(false);
      return toast.error('No puede haber más de un mes de diferencia');
    }
    
    if (initialDate > finalDate) {
      setSubmiting(false);
      return toast.error('Rango de fechas inválido');
    }

    await axios.post('/api/samples/search', {
      initialDate,
      finalDate,
      type: serviceType,
    })
    .then((response) => {
      setSamples(response.data.samples);

      setSubmiting(false);
      setSearched(true);

      setSelectedInitialDate(initialDate);
      setSelectedFinalDate(finalDate);
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      setSubmiting(false);
      setSearched(true);
    })
  }

  const alternateService = () => {
    setSamples(null);

    if (serviceType === 'processing') {
      setServiceType('staining');

    } else {
      setServiceType('processing');
    }
  }

  if (isLoading || !userInfo) {
    return <LoadingSpinner />
  }

  return (
    <div className='m-4 mt-16 flex flex-col gap-4'>
      <div className='flex flex-row gap-4 items-center justify-center'>
        <Label className='font-semibold text-lg hidden sm:flex'>
          Buscar muestras desde:
        </Label> 
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !initialDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {initialDate ? format(initialDate, "PPP") : <span>Seleccione una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={initialDate}
              onSelect={setInitialDate}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Label className='font-semibold text-lg hidden sm:flex'>
          hasta:
        </Label> 
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !finalDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {finalDate ? format(finalDate, "PPP") : <span>Seleccione una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={finalDate}
              onSelect={setFinalDate}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button 
          className='w-32'
          onClick={handleSearch}
        >
          {submiting ? 'Cargando...' : 'Buscar'}
        </Button>
        <Button 
          className={`${!samples || samples.length === 0 ? 'bg-gray-400 hover:cursor-not-allowed hover:bg-gray-400' : ''} w-32`}
          onClick={!samples || samples.length === 0 ? () => {} : () => generatePDF(targetRef, {filename: `Muestras ${formatDateTime(new Date())}`, page: { margin: 4 }})}
        >
          Imprimir
        </Button>
        <Button onClick={alternateService}>
          {serviceType === 'processing' ? 'Procesamiento' : 'Tinción'}
        </Button>
      </div>
      <div 
        className='flex flex-col gap-2 h-full items-center'
        ref={targetRef}
      >
        {!searched ? 
          <h1 className='text-center font-semibold text-lg'>Seleccione un rango de fechas.</h1>
            :  
          !samples || samples!.length === 0 ? 
            <h1 className='text-center font-semibold text-lg'>Ninguna muestra encontrada.</h1>
              :
              <div>
                <div className='flex flex-col gap-4 mb-2 items-center'>
                  <h1 className='text-center font-semibold text-lg'>Muestras desde el {selectedInitialDate?.toLocaleDateString()} hasta el {selectedFinalDate?.toLocaleDateString()}.</h1>
                  <TableHeader
                    print={true}
                    type={serviceType}
                  />
                </div>  
                {samples?.map((sample, index) => {
                  return (
                    <div
                      key={`${sample._id}-${sample.code}-${sample.date}`}
                      // className={`${(index < 26 && (index + 1) % 26 === 0) ? 'mb-10' : ''}`}
                    >
                      <SampleCard 
                        code={sample.code}
                        date={sample.createdAt}
                        researcher={`${sample.researcher.name} ${sample.researcher.lastname}`}
                        sampleType={sample.sampleType}
                        observations={sample.observations}
                        inclusion={sample.inclusion}
                        semithin={sample.semithin}
                        thin={sample.thin}
                        grid={sample.grid}
                        finished={sample.finished}
                        _id={sample._id}
                        print={true}
                        type={serviceType}
                      />
                    </div> 
                    )
                  })}
              </div>
          }
      </div>
    </div>
  )
}

export default Page;