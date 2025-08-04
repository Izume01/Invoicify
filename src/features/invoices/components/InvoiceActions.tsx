import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

const InvoiceActions = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Actions
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href='' className="text-gray-700">View Invoice</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href='' className="text-gray-700">Edit Invoice</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href='' className="text-gray-700">Delete Invoice</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href='' className="text-gray-700">Download Invoice</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href='' className="text-gray-700">Mark As Paid</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
            
        </DropdownMenu>
    )
}

export default InvoiceActions