const UsersTableHeader = () => {
  return (
    <div className='flex gap-5 bg-white rounded-lg p-4 border border-gray-300'>
      <div className='flex flex-col'>
        <h2 className='text-lg font-semibold mb-4 text-center border-b-2 border-black'>Usuarios</h2>
        <div className='flex gap-4 text-center'>
          <span className='font-semibold w-40 border-b-2 border-black hidden sm:inline'>Nombre</span>
          <span className='font-semibold w-40 border-b-2 border-black hidden sm:inline'>Apellido</span>
          <span className='font-semibold w-48 border-b-2 border-black sm:w-72'>E-Mail</span>
          <span className='font-semibold w-32 border-b-2 border-black sm:w-56'>Rol</span>
        </div>
      </div>
    </div>
  )
};

export default UsersTableHeader;