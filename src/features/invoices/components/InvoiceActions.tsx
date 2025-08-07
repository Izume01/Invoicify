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
import { InvoiceAccessType } from '@prisma/client'

interface Invoice {
    id: number;
    invoiceNumber: string;
    invoiceName: string;
    clientName: string;
    status: string;
    invoiceDate: string;
    dueDate: string;
    currency: string;
    total: number;
    itemCount: number;
    userPermissions: InvoiceAccessType[];
    isOwner: boolean;
}

interface InvoiceActionsProps {
    invoice: Invoice;
    userPermissions: InvoiceAccessType[];
    isOwner: boolean;
}

const InvoiceActions = ({ invoice, userPermissions, isOwner }: InvoiceActionsProps) => {
    const canView = isOwner || userPermissions.includes(InvoiceAccessType.VIEW);
    const canEdit = isOwner || userPermissions.includes(InvoiceAccessType.EDIT);
    const canDelete = isOwner || userPermissions.includes(InvoiceAccessType.DELETE);

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
                
                {canView && (
                    <DropdownMenuItem>
                        <Link href={`/dashboard/invoices/${invoice.id}/view`} className="text-gray-700">
                            View Invoice
                        </Link>
                    </DropdownMenuItem>
                )}
                
                {canEdit && (
                    <DropdownMenuItem>
                        <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="text-gray-700">
                            Edit Invoice
                        </Link>
                    </DropdownMenuItem>
                )}
                
                {canView && (
                    <DropdownMenuItem>
                        <Link href={`/dashboard/invoices/${invoice.id}/download`} className="text-gray-700">
                            Download Invoice
                        </Link>
                    </DropdownMenuItem>
                )}
                
                {canEdit && invoice.status !== 'PAID' && (
                    <DropdownMenuItem>
                        <button 
                            onClick={() => console.log('Mark as paid:', invoice.id)}
                            className="text-gray-700 w-full text-left"
                        >
                            Mark As Paid
                        </button>
                    </DropdownMenuItem>
                )}
                
                {isOwner && (
                    <DropdownMenuItem>
                        <button 
                            onClick={() => console.log('Share invoice:', invoice.id)}
                            className="text-blue-600 w-full text-left"
                        >
                            Share Invoice
                        </button>
                    </DropdownMenuItem>
                )}
                
                {canDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <button 
                                onClick={() => console.log('Delete invoice:', invoice.id)}
                                className="text-red-600 w-full text-left"
                            >
                                Delete Invoice
                            </button>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
            
        </DropdownMenu>
    )
}

export default InvoiceActions