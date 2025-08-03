'use client'

import React from 'react'
import DashboardHeader from '@/components/layouts/DashboardHeader'

const Page = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Clients" />

      <div className="flex flex-1 flex-col p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Client Management</h2>
        <p className="text-gray-600 mb-4">
          Manage your client information, contact details, and billing preferences.
        </p>
        <p className="text-gray-500 text-sm">
          Client management features are coming soon! You'll be able to add new clients, edit their information, and view their invoice history.
        </p>
      </div>
    </div>
  )
}

export default Page
