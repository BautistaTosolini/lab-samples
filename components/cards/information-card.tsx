const InformationCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-10 w-full rounded-md border bg-gray-200 px-3 py-2 text-sm my-2'>
      {children}
    </div>
  )
}

export default InformationCard;