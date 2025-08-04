import React from 'react'
import Navbar from '@/features/dashboard/layout/Navbar'
import { Button } from '@/components/ui/button'
const Hero = () => {
  return (
    <div className='bg-black min-h-screen'>
        <Navbar />

        <section className='min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 text-center'>
            <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                Simplify Your Invoicing
            </h1>
            <p className='text-lg md:text-xl text-gray-400 mb-8 max-w-xl'>
                Generate invoices and personalized email drafts in seconds — powered by AI. The world’s most powerful and easy-to-use invoicing platform. Trusted by businesses of all sizes to send, receive, and manage invoices.
            </p>
            <div className='flex gap-4'>
                <Button className='w-full md:w-auto bg-white text-black hover:bg-gray-200'>Get Started</Button>
            </div>
        </section>
    </div>
  )
}

export default Hero