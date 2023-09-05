import { useRouter } from 'next/navigation';

interface SampleCardProps {
  code: string;
  date: string;
  researcher: string;
  sampleType: string;
  observations: string;
  inclusion: boolean;
  semithin: boolean;
  thin: boolean;
  grid: boolean;
}

const SampleCard = ({ code, date, researcher, sampleType, observations, inclusion, semithin, thin, grid }: SampleCardProps) => {
  const router = useRouter();
  const finalDate = new Date(date);

  return (
    <div 
      className='flex gap-2 bg-white rounded-lg p-4 border border-gray-300 hover:bg-gray-400 cursor-pointer'
      // onClick={() => router.push('')}
    >
      <div className='flex gap-4 text-center'>
        <span className='font-semibold w-20'>
          {code}
        </span>
        <span className='font-semibold w-36'>
          {finalDate.toLocaleDateString()}
        </span>
        <span className='font-semibold w-32'>
          {researcher}
        </span>
        <span className='font-semibold w-32'>
          {sampleType}
        </span>
        <span className='font-semibold w-56'>
          {observations}
        </span>
      </div>
      <div className='flex gap-2 text-center justify-center ml-3'>
        <span className='w-20 font-semibold'>
          {inclusion ? 'v' : 'x'}
        </span>
        <span className='w-20 font-semibold'>
          {semithin ? 'v' : 'x'}
        </span>
        <span className='w-20 font-semibold'>
          {thin ? 'v' : 'x'} 
        </span>
        <span className='w-20 font-semibold'>
          {grid ? 'v' : 'x'}
        </span>
      </div>
    </div>
  )
}

export default SampleCard;