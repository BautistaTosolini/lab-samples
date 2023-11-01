const TableHeader = ({ print = false }) => {
  return (
    <div className={`flex gap-5 bg-white rounded-lg p-4 border border-gray-300 ${print ? 'text-sm' : ''}`}>
      <div className='flex flex-col'>
        <h2 className={`text-lg font-semibold mb-4 text-center border-b-2 border-black ${print ? 'text-sm h-8' : ''}`}>Registro de Ingresos</h2>
        <div className='flex gap-4 text-center'>
          <span className={`font-semibold w-20 border-b-2 border-black flex justify-center ${print ? 'h-8' : ''}`}>Código</span>
          <span className='font-semibold w-34 border-b-2 border-black sm:w-36'>Fecha de Ingreso</span>
          <span className='font-semibold w-40 border-b-2 border-black hidden sm:inline'>Investigador</span>
          <span className='font-semibold w-32 border-b-2 border-black'>Tipo de Muestra</span>
          <span className='font-semibold w-56 border-b-2 border-black hidden sm:inline'>Observaciones</span>
        </div>
      </div>
      <div className='hidden sm:flex flex-col'>
        <h2 className={`text-lg font-semibold mb-4 text-center border-b-2 border-black ${print ? 'text-sm h-8' : ''}`}>Estado</h2>
        <div className='grid grid-cols-4 gap-2 text-center'>
          <span className={`w-20 font-semibold border-b-2 border-black ${print ? 'h-8' : ''}`}>Inclusión</span>
          <span className='w-20 font-semibold border-b-2 border-black'>Semi Fino</span>
          <span className='w-20 font-semibold border-b-2 border-black'>Fino</span>
          <span className='w-20 font-semibold border-b-2 border-black'>Grilla</span>
        </div>
      </div>
    </div>
  )
};

export default TableHeader;