'use client'

import React from 'react'
import { SignedIn, UserButton } from '@clerk/nextjs'

const DashboardHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  )
}

export default DashboardHeader
