'use client'

import React from 'react'
import DashboardHeader from '@/components/layouts/DashboardHeader'

const Page = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader title="Invoices" />

      <div className="flex flex-1 flex-col p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Invoice Management</h2>
        <p className="text-gray-600 mb-4">
          Here you can create, view, and manage all your invoices.
        </p>
        <p className="text-gray-500 text-sm">
          Invoice functionality is coming soon! You'll be able to create professional invoices, track payment status, and send reminders.
        </p>
      </div>
    </div>
  )
}

export default Page
