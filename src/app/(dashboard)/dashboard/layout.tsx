import React from 'react'
import { getRegisterUser } from '@/components/hook/getRegisterUser'
import Sidebar from '@/components/layouts/Sidebar'
import DashboardHeader from '@/components/layouts/DashboardHeader'

type ChildrenProp = {
  children: React.ReactNode
}

const Layout = async ({ children }: ChildrenProp) => {
  const { user, session } = await getRegisterUser()

  if (!user || !session) {
    return <div className='p-6 text-red-600'>Error: User or session not found</div>
  }

  return (
    <div className='flex'>
      <Sidebar />
      <main className='ml-64 min-h-screen w-full bg-gray-50 px-4 sm:px-6 lg:px-8 py-6'>
        <DashboardHeader/>
        {children}
      </main>
    </div>
  )
}

export default Layout
