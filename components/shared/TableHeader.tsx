const TableHeader = () => {
  return (
    <div className='flex gap-5 bg-white rounded-lg p-4 border border-gray-300'>
      <div className='flex flex-col'>
        <h2 className='text-lg font-semibold mb-4 text-center border-b-2 border-black'>Registro de Ingresos</h2>
        <div className='flex gap-4 text-center'>
          <span className='font-semibold w-20 border-b-2 border-black'>Código</span>
          <span className='font-semibold w-36 border-b-2 border-black'>Fecha de Ingreso</span>
          <span className='font-semibold w-40 border-b-2 border-black'>Investigador</span>
          <span className='font-semibold w-32 border-b-2 border-black'>Tipo de Muestra</span>
          <span className='font-semibold w-56 border-b-2 border-black'>Observaciones</span>
        </div>
      </div>
      <div className='flex flex-col'>
        <h2 className='text-lg font-semibold mb-4 text-center border-b-2 border-black'>Estado</h2>
        <div className='grid grid-cols-4 gap-2 text-center'>
          <span className='w-20 font-semibold border-b-2 border-black'>Inclusión</span>
          <span className='w-20 font-semibold border-b-2 border-black'>Semi Fino</span>
          <span className='w-20 font-semibold border-b-2 border-black'>Fino</span>
          <span className='w-20 font-semibold border-b-2 border-black'>Grilla</span>
        </div>
      </div>
    </div>
  )
};

export default TableHeader;