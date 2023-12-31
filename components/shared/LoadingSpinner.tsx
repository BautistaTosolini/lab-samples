const LoadingSpinner = () => {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-300 flex flex-col items-center justify-center'>
      <div className='loader ease-linear rounded-full border-4 border-t-4 border-white h-12 w-12 mb-4'></div>
      <h2 className='text-center text-xl font-semibold font-[#0f172a]'>Cargando...</h2>
    </div>
  )
};

export default LoadingSpinner;