import React from 'react'
import { SignedIn , UserButton } from '@clerk/nextjs'

const page = () => {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between py-4   border-b border-gray-200">
        <h1 className='font-bold text-2xl md:text-3xl text-gray-900'>Dashboard</h1>
        <SignedIn>
        <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Welcome Content */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to the dashboard!</h2>
        <p className="text-gray-600 mb-4">
          This is where you can find all your important information at a glance.
        </p>
        <p className="text-gray-500 text-sm">
          Stay tuned for more updates and features coming soon!
        </p>
        </div>
      </div>
      </div>
    </main>
  )
}

export default page