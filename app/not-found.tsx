'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const Page =({
  children,
}: {
  children: React.ReactNode
}) => {
  const router = useRouter();

  return (
    <main className='w-full flex justify-center min-h-screen bg-gray-300 items-center'>
      <Card className='w-[300px]'>
        <CardHeader>
          <CardTitle>
            Pagina no encontrada
          </CardTitle>
          <CardDescription>
            Error 404
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center gap-4'>
          <p>
            La pagina solicitada no existe, presione el botón para volver a la pagina anterior.
          </p>
          <Button 
            className='w-full'
            onClick={() => router.back()}
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default Page;
