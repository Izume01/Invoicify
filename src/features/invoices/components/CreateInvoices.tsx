"use client"

import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

const CreateInvoices: React.FC = () => {

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);
  const [paymentTerms, setPaymentTerms] = useState<string | undefined>(undefined);
  const [invoiceItems, setInvoiceItems] = useState<{ itemName: string; itemDescription?: string; itemQuantity: number; itemPrice: number; itemTotal: number }[]>([]);
  const [invoiceTotal, setInvoiceTotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [invoiceNote, setInvoiceNote] = useState<string>("");
  const [invoiceName, setInvoiceName] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceStatus, setInvoiceStatus] = useState<string>("draft");
  const [currency, setCurrency] = useState<string>("USD");
  const [fromName, setFromName] = useState<string>("");
  const [fromEmail, setFromEmail] = useState<string>("");
  const [fromAddress, setFromAddress] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");
  const [cryptoAddress, setCryptoAddress] = useState<string>("");
  const [paypalEmail, setPaypalEmail] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [swiftCode, setSwiftCode] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [invoiceItemsCount, setInvoiceItemsCount] = useState<number>(1);
  const [invoiceItemsList, setInvoiceItemsList] = useState<{ itemName: string; itemDescription?: string; itemQuantity: number; itemPrice: number; itemTotal: number }[]>([
    { itemName: '', itemDescription: '', itemQuantity: 1, itemPrice: 0, itemTotal: 0 }
  ]);



  return (
    <div className='p-6  rounded-lg border-2 border-dotted'>
      <h1 className="text-2xl font-bold ">Create Invoice</h1>
      <p className="mb-6 text-gray-500">Use the form below to create a new invoice.</p>

      {/* YeHa Components */}

      <div className="flex items-center space-x-3 w-fit">
        <Badge
          variant="outline"
          className="text-sm px-3 py-1.5 h-10 flex items-center"
        >
          Draft
        </Badge>
        <Input
          id="invoice-draft"
          value={invoiceName}
          onChange={(e) => setInvoiceName(e.target.value)}
          placeholder="Enter invoice draft name"
          className="h-10 w-72"
        />
      </div>



      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className='flex flex-col space-y-2'>
          <Label className='mb-4'>Invoice Number</Label>
          <div className="flex items-center">
            <span className='text-sm px-3 py-2 rounded rounded-r-none bg-zinc-200'>#</span>
            <Input
              id='invoice-number'
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder='Enter Invoice Number'
              className='rounded-l-none'
            ></Input>
          </div>
        </div>

        <div className='flex flex-col space-y-2'>
          <Label className='mb-4'>Currency</Label>
          <Select onValueChange={setCurrency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
              <SelectItem value="inr">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>From</Label>
          <div>
            <Input
              id="from-name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 mb-4"
            />
            <Input
              id="from-email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="Enter your email"
              className="mb-4"
            />
            <Input
              id="from-address"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              placeholder="Enter your address"
              className="mb-4"
            />
          </div>
        </div>

        <div>
          <Label>To</Label>

          <div>
            <Input
              id="to-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              className="mt-2 mb-4"
            />
            <Input
              id="to-email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Enter client email"
              className="mb-4"
            />
            <Input
              id="to-address"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Enter client address"
              className="mb-4"
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mt-6'>
        <div>
          <Label>Select Todays Date</Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button  
                variant={"outline"} 
                className="w-full mt-2">
                {date ? date.toLocaleDateString() : "Select date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>

        </div>

        <div>
          <Label>Due Date</Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full mt-2">
                {dueDate ? dueDate.toLocaleDateString() : "Select due date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='flex flex-col space-y-2'>
          <Label>Payment Terms</Label>
          <Select onValueChange={setPaymentTerms}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net45">Net 45</SelectItem>
              <SelectItem value="net60">Net 60</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col space-y-2'>
          <Label>Payment Method</Label>
          <Select onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="crypto">Crypto (BTC)</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paymentMethod === 'crypto' && (
        <div className="mt-6 flex flex-col space-y-2">
          <Label htmlFor="crypto-address">Crypto Address</Label>
          <Input id="crypto-address" placeholder="Enter your crypto address" />
        </div>
      )
      }


      {paymentMethod === "paypal" && (
        <div className="mt-6 flex flex-col space-y-2">
          <Label htmlFor="paypal">PayPal Email</Label>
          <Input id="paypal" placeholder="you@example.com" />
        </div>
      )}

      {paymentMethod === "bank" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='space-y-2'>
            <Label htmlFor="account-number">Account Number</Label>
            <Input id="account-number" placeholder="1234567890" />
          </div>
          <div className='space-y-2'>
            <Label htmlFor="swift">SWIFT Code</Label>
            <Input id="swift" placeholder="AAAABBCC123" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input id="bank-name" placeholder="Bank of America" />
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Invoice Items</h2>
          <Button variant="outline" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Item
          </Button>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <thead className="bg-muted/50">
              <tr>
                <th className="w-[30%] p-3 font-medium">Item</th>
                <th className="w-[30%] p-3 font-medium">Description</th>
                <th className="w-[10%] p-3 font-medium text-center">Quantity</th>
                <th className="w-[15%] p-3 font-medium text-right">Price</th>
                <th className="w-[15%] p-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-muted/50 transition-colors">
                <td className="p-3">
                  <Input placeholder="Item Name" className="border-0 shadow-none focus-visible:ring-0 bg-transparent" />
                </td>
                <td className="p-3">
                  <Input placeholder="Description" className="border-0 shadow-none focus-visible:ring-0 bg-transparent" />
                </td>
                <td className="p-3">
                  <Input type="number" placeholder="0" min="1" className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-center" />
                </td>
                <td className="p-3">
                  <Input type="number" placeholder="0.00" min="0" step="0.01" className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-right" />
                </td>
                <td className="p-3">
                  <Input type="number" placeholder="0.00" readOnly className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-right opacity-70" />
                </td>
              </tr>
            </tbody>
            <tfoot className="border-t bg-muted/30">
              <tr>
                <td colSpan={3} className="p-3"></td>
                <td className="p-3 text-right font-medium">Subtotal:</td>
                <td className="p-3 text-right">$0.00</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-3"></td>
                <td className="p-3 text-right font-medium">Tax (0%):</td>
                <td className="p-3 text-right">$0.00</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-3"></td>
                <td className="p-3 text-right font-medium">Total:</td>
                <td className="p-3 text-right font-bold">$0.00</td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>

      {/* notes */}

      <div className="mt-6">
        <Label htmlFor="invoice-notes" className="block mb-2 font-medium">Notes</Label>
        <Textarea
          id="invoice-notes"
          placeholder="Add any additional notes or instructions for the client here."
          className="h-24"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="px-6 py-2" variant={'default'}>
          Create Invoice
        </Button>
      </div>

    </div>
  )
}

export default CreateInvoices