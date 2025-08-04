'use client'

import React from 'react'
import { SignedIn, UserButton } from '@clerk/nextjs'

const DashboardHeader = () => {
  return (
    <SignedIn>
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className='w-full'>
        <div className='flex items-center justify-end px-10'>
          
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: '34px',
                    height: '34px',
                  },
                },
              }} />
          
        </div>
      </div>
    </div>
    </SignedIn>
  )
}

export default DashboardHeader
