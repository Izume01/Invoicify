"use client"

import {z} from "zod";
import { invoiceSchema } from "@/utils/zodSchema";
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
import { Delete } from 'lucide-react'

const CreateInvoices: React.FC = () => {

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);
  const [paymentTerms, setPaymentTerms] = useState<string | undefined>(undefined);
  const [invoiceTotal, setInvoiceTotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [invoiceNote, setInvoiceNote] = useState<string>("");
  const [invoiceName, setInvoiceName] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
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
  const [invoiceItemsCount, setInvoiceItemsCount] = useState<number>(1);
  const [invoiceItemsList, setInvoiceItemsList] = useState<{ itemName: string; itemDescription?: string; itemQuantity: number; itemPrice: number; itemTotal: number }[]>([
    { itemName: '', itemDescription: '', itemQuantity: 1, itemPrice: 0, itemTotal: 0 }
  ]);
  const [error , setError] = useState<Record<string , string>>({});


  function addInvoiceItem() {
    setInvoiceItemsList([...invoiceItemsList, { itemName: '', itemDescription: '', itemQuantity: 1, itemPrice: 0, itemTotal: 0 }]);
    setInvoiceItemsCount(invoiceItemsCount + 1);
  }

  function calculateSubtoal() {
    const total = invoiceItemsList.reduce((acc, item) => {
      // Fix: Check for valid numbers and default to 0 if NaN
      const quantity = isNaN(item.itemQuantity) ? 0 : item.itemQuantity;
      const price = isNaN(item.itemPrice) ? 0 : item.itemPrice;
      return acc + (quantity * price);
    }, 0);

    setSubtotal(total);

    const tax = (total * taxRate) / 100;
    setTaxAmount(tax);

    setInvoiceTotal(total + tax);
  }

  useEffect(() => {
    calculateSubtoal();
  }, [invoiceItemsList]);


  function handleSubmit () {
      setError({});

      const formData = {
        invoiceName,
        invoiceNumber,
        currency,
        date: date?.toISOString() || null,
        dueDate: dueDate?.toISOString() || null,
        paymentTerms,
        paymentMethod,
        fromName,
        fromEmail,
        fromAddress,
        clientName,
        clientEmail,
        clientAddress,
        cryptoAddress,
        paypalEmail,
        accountNumber,
        swiftCode,
        bankName,
        invoiceItemsList: invoiceItemsList.map(item => ({
          itemName: item.itemName,
          itemDescription: item.itemDescription || '',
          itemQuantity: item.itemQuantity,
          itemPrice: item.itemPrice
        })),
        subtotal: subtotal.toFixed(2),
        taxRate: taxRate.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        invoiceTotal: invoiceTotal.toFixed(2),
        invoiceNote
      } 

      try {
        console.log("Form Data Before Validation", formData);
        
        const validatedFormData =  invoiceSchema.parse(formData);

        console.log("Validated Form Data", validatedFormData);
      } catch (error) {
          if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach(err => {
              if (err.path.length > 0) {
                // Handle nested paths for array items
                const pathString = err.path.join('.');
                fieldErrors[pathString] = err.message;
              }
            });
            setError(fieldErrors);
          }
      }
  }

  // Add a helper function to clear specific errors
  function clearError(fieldName: string) {
    setError(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }

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
        <div className="flex flex-col">
          <Input
            id="invoice-draft"
            value={invoiceName}
            onChange={(e) => {
              setInvoiceName(e.target.value);
              clearError('invoiceName'); // Clear error when typing
            }}
            placeholder="Enter invoice draft name"
            className="h-10 w-72"
          />
          {error.invoiceName && (
            <span className="text-red-500 text-sm mt-1">{error.invoiceName}</span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className='flex flex-col space-y-2'>
          <Label className='mb-4'>Invoice Number</Label>
          <div className="flex items-center">
            <span className='text-sm px-3 py-2 rounded rounded-r-none bg-zinc-200'>#</span>
            <Input
              id='invoice-number'
              value={invoiceNumber}
              onChange={(e) => {
                setInvoiceNumber(e.target.value);
                clearError('invoiceNumber'); // Clear error when typing
              }}
              placeholder='Enter Invoice Number'
              className='rounded-l-none'
            />
          </div>
          {error.invoiceNumber && (
            <span className="text-red-500 text-sm">{error.invoiceNumber}</span>
          )}
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
          {error.currency && (
            <span className="text-red-500 text-sm">{error.currency}</span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>From</Label>
          <div>
            <Input
              id="from-name"
              value={fromName}
              onChange={(e) => {
                setFromName(e.target.value);
                clearError('fromName'); // Clear error when typing
              }}
              placeholder="Enter your name"
              className="mt-2 mb-4"
            />
            {error.fromName && (
              <span className="text-red-500 text-sm block -mt-3 mb-3">{error.fromName}</span>
            )}
            <Input
              id="from-email"
              value={fromEmail}
              onChange={(e) => {
                setFromEmail(e.target.value);
                clearError('fromEmail'); // Clear error when typing
              }}
              placeholder="Enter your email"
              className="mb-4"
            />
            {error.fromEmail && (
              <span className="text-red-500 text-sm block -mt-3 mb-3">{error.fromEmail}</span>
            )}
            <Input
              id="from-address"
              value={fromAddress}
              onChange={(e) => {
                setFromAddress(e.target.value);
                clearError('fromAddress'); // Clear error when typing
              }}
              placeholder="Enter your address"
              className="mb-4"
            />
            {error.fromAddress && (
              <span className="text-red-500 text-sm block -mt-3 mb-3">{error.fromAddress}</span>
            )}
          </div>
        </div>

        <div>
          <Label>To</Label>
          <div>
            <Input
              id="to-name"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                clearError('clientName'); // Clear error when typing
              }}
              placeholder="Enter client name"
              className="mt-2 mb-4"
            />
            {error.clientName && (
              <span className="text-red-500 text-sm block -mt-3 mb-3">{error.clientName}</span>
            )}
            <Input
              id="to-email"
              value={clientEmail}
              onChange={(e) => {
                setClientEmail(e.target.value);
                clearError('clientEmail'); // Clear error when typing
              }}
              placeholder="Enter client email"
              className="mb-4"
            />
            {error.clientEmail && (
              <span className="text-red-500 text-sm block -mt-3 mb-3">{error.clientEmail}</span>
            )}
            <Input
              id="to-address"
              value={clientAddress}
              onChange={(e) => {
                setClientAddress(e.target.value);
                clearError('clientAddress'); // Clear error when typing
              }}
              placeholder="Enter client address"
              className="mb-4"
            />
            {error.clientAddress && (
              <span className="text-red-500 text-sm block -mt-3 mb-3">{error.clientAddress}</span>
            )}
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
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  clearError('date'); // Clear error when selecting date
                }}
              />
            </PopoverContent>
          </Popover>
          {error.date && (
            <span className="text-red-500 text-sm block mt-1">{error.date}</span>
          )}
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
                onSelect={(selectedDate) => {
                  setDueDate(selectedDate);
                  clearError('dueDate'); // Clear error when selecting date
                }}
              />
            </PopoverContent>
          </Popover>
          {error.dueDate && (
            <span className="text-red-500 text-sm block mt-1">{error.dueDate}</span>
          )}
        </div>

        <div className='flex flex-col space-y-2'>
          <Label>Payment Terms</Label>
          <Select onValueChange={(value) => {
            setPaymentTerms(value);
            clearError('paymentTerms'); // Clear error when selecting
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net45">Net 45</SelectItem>
              <SelectItem value="net60">Net 60</SelectItem>
            </SelectContent>
          </Select>
          {error.paymentTerms && (
            <span className="text-red-500 text-sm">{error.paymentTerms}</span>
          )}
        </div>

        <div className='flex flex-col space-y-2'>
          <Label>Payment Method</Label>
          <Select onValueChange={(value) => {
            setPaymentMethod(value);
            clearError('paymentMethod'); // Clear error when selecting
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="crypto">Crypto (BTC)</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
            </SelectContent>
          </Select>
          {error.paymentMethod && (
            <span className="text-red-500 text-sm">{error.paymentMethod}</span>
          )}
        </div>
      </div>

      {paymentMethod === 'crypto' && (
        <div className="mt-6 flex flex-col space-y-2">
          <Label htmlFor="crypto-address">Crypto Address</Label>
          <Input
            value={cryptoAddress}
            onChange={(e) => {
              setCryptoAddress(e.target.value);
              clearError('cryptoAddress'); // Clear error when typing
            }}
            id="crypto-address"
            placeholder="Enter your crypto address"
          />
          {error.cryptoAddress && (
            <span className="text-red-500 text-sm">{error.cryptoAddress}</span>
          )}
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="mt-6 flex flex-col space-y-2">
          <Label htmlFor="paypal">PayPal Email</Label>
          <Input
            value={paypalEmail}
            onChange={(e) => {
              setPaypalEmail(e.target.value);
              clearError('paypalEmail'); // Clear error when typing
            }}
            id="paypal"
            placeholder="you@example.com"
          />
          {error.paypalEmail && (
            <span className="text-red-500 text-sm">{error.paypalEmail}</span>
          )}
        </div>
      )}

      {paymentMethod === "bank" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='space-y-2'>
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                clearError('accountNumber'); // Clear error when typing
              }}
              id="account-number"
              placeholder="1234567890"
            />
            {error.accountNumber && (
              <span className="text-red-500 text-sm">{error.accountNumber}</span>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor="swift">SWIFT Code</Label>
            <Input
              value={swiftCode}
              onChange={(e) => {
                setSwiftCode(e.target.value);
                clearError('swiftCode'); // Clear error when typing
              }}
              id="swift"
              placeholder="AAAABBCC123"
            />
            {error.swiftCode && (
              <span className="text-red-500 text-sm">{error.swiftCode}</span>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              value={bankName}
              onChange={(e) => {
                setBankName(e.target.value);
                clearError('bankName'); // Clear error when typing
              }}
              id="bank-name"
              placeholder="Bank of America"
            />
            {error.bankName && (
              <span className="text-red-500 text-sm">{error.bankName}</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Invoice Items</h2>
          <Button onClick={addInvoiceItem} variant="outline" size="sm">
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
                <th className="w-[20%] p-3 font-medium text-center">Price</th>
                <th className="w-[10%] p-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItemsList.map((item, index) => (
                <tr key={index} className="border-t hover:bg-muted/50 transition-colors group">
                  <td className="p-3 border-b">
                    <Input
                      value={item.itemName}
                      onChange={(e) => {
                        const newItems = [...invoiceItemsList];
                        newItems[index].itemName = e.target.value;
                        setInvoiceItemsList(newItems);
                        clearError(`invoiceItemsList.${index}.itemName`); // Clear specific item error
                      }}
                      placeholder="Item Name"
                    />
                    {error[`invoiceItemsList.${index}.itemName`] && (
                      <span className="text-red-500 text-sm block mt-1">{error[`invoiceItemsList.${index}.itemName`]}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Input
                      value={item.itemDescription}
                      onChange={(e) => {
                        const newItems = [...invoiceItemsList];
                        newItems[index].itemDescription = e.target.value;
                        setInvoiceItemsList(newItems);
                        clearError(`invoiceItemsList.${index}.itemDescription`); // Clear specific item error
                      }}
                      placeholder="Item Description"
                    />
                    {error[`invoiceItemsList.${index}.itemDescription`] && (
                      <span className="text-red-500 text-sm block mt-1">{error[`invoiceItemsList.${index}.itemDescription`]}</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <Input
                      type="number"
                      value={item.itemQuantity}
                      onChange={(e) => {
                        const newItems = [...invoiceItemsList];
                        const value = e.target.value === '' ? 1 : parseInt(e.target.value, 10);
                        newItems[index].itemQuantity = isNaN(value) ? 1 : value;
                        setInvoiceItemsList(newItems);
                        clearError(`invoiceItemsList.${index}.itemQuantity`); // Clear specific item error
                      }}
                      min="1"
                    />
                    {error[`invoiceItemsList.${index}.itemQuantity`] && (
                      <span className="text-red-500 text-sm block mt-1">{error[`invoiceItemsList.${index}.itemQuantity`]}</span>
                    )}
                  </td>
                  <td className="p-3 text-right ">
                    <Input
                      type="number"
                      value={item.itemPrice}
                      onChange={(e) => {
                        const newItems = [...invoiceItemsList];
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        newItems[index].itemPrice = isNaN(value) ? 0 : value;
                        setInvoiceItemsList(newItems);
                        clearError(`invoiceItemsList.${index}.itemPrice`); // Clear specific item error
                      }}
                      min="0"
                      step="0.01"
                    />
                    {error[`invoiceItemsList.${index}.itemPrice`] && (
                      <span className="text-red-500 text-sm block mt-1">{error[`invoiceItemsList.${index}.itemPrice`]}</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-semibold">
                        {/* Fix: Add safety check for NaN values */}
                        ${(!isNaN(item.itemQuantity) && !isNaN(item.itemPrice)
                          ? (item.itemQuantity * item.itemPrice).toFixed(2)
                          : '0.00')}
                      </span>

                      <Button
                        className="ml-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-full h-7 w-7 p-0"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newItems = invoiceItemsList.filter((_, i) => i !== index);
                          setInvoiceItemsList(newItems);
                          setInvoiceItemsCount(invoiceItemsCount - 1);
                        }}
                        title="Delete item"
                      >
                        <Delete className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t bg-muted/30">
              <tr>
                <td colSpan={3} className="p-3"></td>
                <td className="p-3 text-right font-medium">Subtotal:</td>
                <td className="p-3 text-right">${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-3"></td>
                <td className="p-3 text-right font-medium">Tax ({taxRate}%):</td>
                <td className="p-3 text-right">${taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-3"></td>
                <td className="p-3 text-right font-medium">Total:</td>
                <td className="p-3 text-right font-bold">${invoiceTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>

      {/* Add a tax rate input field */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className='flex flex-col space-y-2'>
          <Label>Tax Rate (%)</Label>
          <Input
            type="number"
            value={taxRate}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
              setTaxRate(isNaN(value) ? 0 : value);
              clearError('taxRate'); // Clear error when typing
            }}
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
          />
          {error.taxRate && (
            <span className="text-red-500 text-sm">{error.taxRate}</span>
          )}
        </div>
      </div>

      {/* notes */}
      <div className="mt-6">
        <Label htmlFor="invoice-notes" className="block mb-2 font-medium">Notes</Label>
        <Textarea
          id="invoice-notes"
          value={invoiceNote}
          onChange={(e) => {
            setInvoiceNote(e.target.value);
            clearError('invoiceNote'); // Clear error when typing
          }}
          placeholder="Add any additional notes or instructions for the client here."
          className="h-24"
        />
        {error.invoiceNote && (
          <span className="text-red-500 text-sm block mt-1">{error.invoiceNote}</span>
        )}
      </div>

      {/* Display invoice items errors */}
      {error.invoiceItemsList && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <span className="text-red-600 text-sm">{error.invoiceItemsList}</span>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSubmit} className="px-6 py-2" variant={'default'}>
          Create Invoice
        </Button>
      </div>

    </div>
  )
}

export default CreateInvoices