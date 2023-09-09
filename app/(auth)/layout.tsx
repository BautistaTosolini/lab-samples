import { Inter } from 'next/font/google';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Muestras de Laboratorio',
  description: 'Un proyecto de Next.js 13'
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <div className='w-full flex justify-center items-center min-h-screen bg-gray-300'>
          {children}
        </div>
      </body>
    </html>
  )
};