'use client'

import React from 'react'
import DashboardHeader from '@/components/layouts/DashboardHeader'
import HeaderLayout from '@/components/layouts/HeaderLayout'
const Page = () => {
  return (
    <div className="space-y-8">
      <div className=" flex flex-1 flex-col p-2 rounded-lg ">
        <HeaderLayout />
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
