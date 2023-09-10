import { CheckSquare, Square } from 'lucide-react';
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
  _id: string;
}

const SampleCard = ({ code, date, researcher, sampleType, observations, inclusion, semithin, thin, grid, _id }: SampleCardProps) => {
  const router = useRouter();
  const finalDate = new Date(date);

  return (
    <div 
      className='flex gap-2 bg-white rounded-lg p-4 border border-gray-300 hover:bg-gray-400 cursor-pointer mb-2'
      onClick={() => router.push(`/dashboard/${_id}`)}
    >
      <div className='flex gap-4 text-center'>
        <span className='font-semibold w-20 truncate'>
          {code}
        </span>
        <span className='font-semibold w-36 truncate'>
          {finalDate.toLocaleDateString()}
        </span>
        <span className='font-semibold w-40 truncate'>
          {researcher}
        </span>
        <span className='font-semibold w-32 truncate'>
          {sampleType}
        </span>
        <span className='font-semibold w-56 truncate'>
          {observations}
        </span>
      </div>
      <div className='flex gap-2 text-center justify-center ml-3'>
        <span className='w-20 font-semibold justify-center flex'>
          {inclusion ? <CheckSquare /> : <Square />}
        </span>
        <span className='w-20 font-semibold justify-center flex'>
          {semithin ? <CheckSquare /> : <Square />}
        </span>
        <span className='w-20 font-semibold justify-center flex'>
          {thin ? <CheckSquare /> : <Square />} 
        </span>
        <span className='w-20 font-semibold justify-center flex'>
          {grid ? <CheckSquare /> : <Square />}
        </span>
      </div>
    </div>
  )
}

export default SampleCard;