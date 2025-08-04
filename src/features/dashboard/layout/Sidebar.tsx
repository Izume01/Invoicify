'use client'

import React from 'react'
import { ChevronRight, Menu, LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings }, 
  // Add more items as needed
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className='bg-slate-900 text-slate-100 w-64 h-screen p-4 fixed flex flex-col space-y-6 border-r border-slate-300 shadow-2xl shadow-slate-900/50'>
      {/* Logo + Menu */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <Link href="/" className='text-2xl font-bold hover:text-slate-300 transition-colors'>
            Invoicify
          </Link>
          <button className='p-2 rounded-md hover:bg-slate-800'>
            <Menu className='h-6 w-6' />
          </button>
        </div>
        <div className='border-b border-slate-700'></div>
      </div>

      {/* Navigation */}
      <nav className='flex-grow'>
        <ul className='space-y-2'>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  <span>{item.name}</span>
                  {isActive && <ChevronRight className='ml-auto h-5 w-5' />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className='mt-auto'>
        <div className='border-t border-slate-700 my-4'></div>
        <button className='w-full flex items-center p-2 rounded-md transition-colors text-slate-400 hover:bg-red-500/20 hover:text-red-400'>
          <LogOut className='mr-3 h-5 w-5' />
          <span>Log Out</span>
        </button>
        <p className='text-xs text-center text-slate-500 mt-4'>© 2025 Invoicify</p>
      </div>
    </aside>
  )
}

export default Sidebar
