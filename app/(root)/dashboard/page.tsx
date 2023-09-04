'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  // const onClick = async () => {
  //   await axios.get('/api/auth/logout')

  //   router.push('/sign-in')
  // };

  return (
    <div>
      Cerrar Sesión
    </div>
  )
};

export default Page;