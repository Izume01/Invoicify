'use client'

import React from 'react'
import DashboardHeader from '@/components/layouts/DashboardHeader'
const Page = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Dashboard" />

      <div className=" flex flex-1 flex-col p-2 rounded-lg ">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to the dashboard!</h2>
        <p className="text-gray-600 mb-4">
          This is where you can find all your important information at a glance.
        </p>
        <p className="text-gray-500 text-sm">
          Stay tuned for more updates and features coming soon!
        </p>
      </div>
    </div>
  )
}

export default Page
