'use client'

import React from 'react'
import { ChevronRight, Menu, LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className='bg-slate-900 text-slate-100 w-64 h-full p-4 fixed flex flex-col border-r border-slate-300 shadow-2xl shadow-slate-900/50'>
            <div className='flex-shrink-0'>
                <h2 className='text-2xl font-bold mb-4'>
                    <div className='flex items-center justify-between'>
                        <Link href="/" className='hover:text-slate-300 transition-colors'>Invoicify</Link>
                        <button className='p-1 rounded-md hover:bg-slate-800'>
                            <Menu className='h-6 w-6' />
                        </button>
                    </div>
                </h2>

                <div className='my-6 border-b border-slate-700'></div>
            </div>

            <nav className='flex-grow'>
                <ul className='space-y-2'>
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <li key={item.name}>
                                <Link href={item.href} className={`flex items-center p-2 rounded-md transition-colors ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                    <item.icon className='mr-3 h-5 w-5' />
                                    <span>{item.name}</span>
                                    {isActive && <ChevronRight className='ml-auto h-5 w-5' />}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className='mt-auto'>
                 <div className='my-4 border-t border-slate-700'></div>
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