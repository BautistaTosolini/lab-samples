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
  finished: boolean;
  _id: string;
}

const SampleCard = ({ code, date, researcher, sampleType, observations, inclusion, semithin, thin, grid, _id, finished }: SampleCardProps) => {
  const router = useRouter();
  const finalDate = new Date(date);

  return (
    <div 
      className={`flex gap-2 rounded-lg p-4 border border-gray-300 hover:bg-gray-400 cursor-pointer mb-2 ${finished ? 'bg-gray-400' : 'bg-white'}`}
      onClick={() => router.push(`/dashboard/${_id}`)}
    >
      <div className='flex gap-4 text-center'>
        <span className='font-semibold w-20 truncate'>
          {code}
        </span>
        <span className='font-semibold w-34 truncate sm:w-36'>
          {finalDate.toLocaleDateString()}
        </span>
        <span className='font-semibold w-40 truncate hidden sm:inline'>
          {researcher}
        </span>
        <span className='font-semibold w-32 truncate'>
          {sampleType}
        </span>
        <span className='font-semibold w-56 truncate hidden sm:inline'>
          {observations}
        </span>
      </div>
      <div className='gap-2 text-center justify-center ml-3 hidden sm:flex'>
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