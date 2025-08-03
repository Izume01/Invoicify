'use client'

import React from 'react'
import DashboardHeader from '@/components/layouts/DashboardHeader'

const Page = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Settings" />

      <div className="flex flex-1 flex-col p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Settings</h2>
        <p className="text-gray-600 mb-4">
          Configure your account preferences, payment methods, and business information.
        </p>
        <p className="text-gray-500 text-sm">
          Settings panel is coming soon! You'll be able to customize your invoice templates, set payment terms, and manage your account details.
        </p>
      </div>
    </div>
  )
}

export default Page
