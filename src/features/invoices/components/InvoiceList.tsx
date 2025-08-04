import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

import InvoiceActions from './InvoiceActions'

const statusColors: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800'
}

const invoices = [
    {
        id: 'INV-001',
        clientName: 'John Doe',
        amount: '$500.00',
        status: 'Paid',
        dateIssued: '2023-10-01'
    },
    {
        id: 'INV-002',
        clientName: 'Jane Smith',
        amount: '$750.00',
        status: 'Pending',
        dateIssued: '2023-10-05'
    },
    {
        id: 'INV-003',
        clientName: 'Acme Corp',
        amount: '$1,200.00',
        status: 'Overdue',
        dateIssued: '2023-09-20'
    }
]

const InvoiceList = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-100">
                    <TableHead className="w-[100px] font-semibold text-gray-700">Invoice ID</TableHead>
                    <TableHead className="w-[200px] font-semibold text-gray-700">Client Name</TableHead>
                    <TableHead className="w-[150px] font-semibold text-gray-700">Amount</TableHead>
                    <TableHead className="w-[150px] font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="w-[200px] font-semibold text-gray-700">Date Issued</TableHead>
                    <TableHead className="w-[100px] font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow
                        key={invoice.id}
                        className="group hover:bg-muted/50 transition-all border-b border-gray-100"
                    >
                        <TableCell className="font-mono text-xs text-muted-foreground">{invoice.id}</TableCell>
                        <TableCell className="text-sm text-gray-800">{invoice.clientName}</TableCell>
                        <TableCell className="font-semibold text-sm text-gray-900">{invoice.amount}</TableCell>
                        <TableCell>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[invoice.status]}`}>
                                {invoice.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{invoice.dateIssued}</TableCell>
                        <TableCell>
                            <InvoiceActions />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter className=''>
                <TableRow>
                    <TableCell colSpan={6} className="text-right font-semibold bg-gray-50 mt-2">
                        <div className="flex justify-between items-center">
                            <span>Total Invoices: {invoices.length}</span>
                            <span>
                                Total Amount: {invoices.reduce((sum, invoice) => {
                                    const amount = parseFloat(invoice.amount.replace('$', '').replace(',', ''));
                                    return sum + amount;
                                }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </span>
                        </div>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default InvoiceList