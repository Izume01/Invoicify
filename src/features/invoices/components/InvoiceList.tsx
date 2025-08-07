'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { InvoiceAccessType } from '@prisma/client'
import InvoiceActions from './InvoiceActions'

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

const statusColors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800',
    SENT: 'bg-blue-100 text-blue-800',
    DRAFT: 'bg-yellow-100 text-yellow-800',
    OVERDUE: 'bg-red-100 text-red-800'
}

const InvoiceList = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('/api/v1/invoices');
                const data = await response.json();
                
                if (data.success) {
                    setInvoices(data.invoices);
                } else {
                    setError(data.error || 'Failed to fetch invoices');
                }
            } catch (err) {
                console.error('Error fetching invoices:', err);
                setError('Failed to fetch invoices');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg">Loading invoices...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-gray-500">No invoices found. Create your first invoice to get started!</div>
            </div>
        );
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-100">
                    <TableHead className="w-[100px] font-semibold text-gray-700">Invoice ID</TableHead>
                    <TableHead className="w-[200px] font-semibold text-gray-700">Client Name</TableHead>
                    <TableHead className="w-[150px] font-semibold text-gray-700">Amount</TableHead>
                    <TableHead className="w-[150px] font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="w-[200px] font-semibold text-gray-700">Date Issued</TableHead>
                    <TableHead className="w-[100px] font-semibold text-gray-700">Access</TableHead>
                    <TableHead className="w-[100px] font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow
                        key={invoice.id}
                        className="group hover:bg-muted/50 transition-all border-b border-gray-100"
                    >
                        <TableCell className="font-mono text-xs text-muted-foreground">{invoice.invoiceNumber}</TableCell>
                        <TableCell className="text-sm text-gray-800">{invoice.clientName}</TableCell>
                        <TableCell className="font-semibold text-sm text-gray-900">
                            {formatCurrency(invoice.total, invoice.currency)}
                        </TableCell>
                        <TableCell>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                                {invoice.status.toLowerCase()}
                            </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {formatDate(invoice.invoiceDate)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            {invoice.isOwner ? (
                                <span className="text-green-600 font-semibold">Owner</span>
                            ) : (
                                <span className="text-blue-600">
                                    {invoice.userPermissions.join(', ')}
                                </span>
                            )}
                        </TableCell>
                        <TableCell>
                            <InvoiceActions 
                                invoice={invoice}
                                userPermissions={invoice.userPermissions}
                                isOwner={invoice.isOwner}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter className=''>
                <TableRow>
                    <TableCell colSpan={7} className="text-right font-semibold bg-gray-50 mt-2">
                        <div className="flex justify-between items-center">
                            <span>Total Invoices: {invoices.length}</span>
                            <span>
                                Total Amount: {invoices.reduce((sum, invoice) => {
                                    return sum + invoice.total;
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