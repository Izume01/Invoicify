import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import React from 'react'
const Navbar = () => {
    return (
        <div>
            <section className='fixed top-0 left-0 right-0 z-50 max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center z-50 border-b border-white/10 justify-between h-16'>
                    <h1 className='text-2xl font-bold text-white'>Invoicify</h1>
                    <div className='flex space-x-8 items-center'>
                        <Link href="/" className='text-gray-300 hover:text-white transition-colors'>Home</Link>
                        <Link href="/" className='text-gray-300 hover:text-white transition-colors'>About</Link>
                        <Link href="/" className='text-gray-300 hover:text-white transition-colors'>Contact</Link>
                        <SignedOut>
                            <SignInButton>
                                <Button>Sign In</Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Navbar