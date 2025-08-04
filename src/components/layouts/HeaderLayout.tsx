import React from 'react'
import { usePathname } from 'next/navigation'


const HeaderLayout = () => {
    const pathname = usePathname()

    const routeMap : Record<string , string> = {
        '/dashboard/settings': 'Settings',
        '/dashboard/clients': 'Clients',
        '/dashboard/invoices': 'Invoices',
        '/dashboard': 'Dashboard',
    }

    const title = routeMap[pathname] || 'Dashboard'

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
        </div>
    )
}

export default HeaderLayout