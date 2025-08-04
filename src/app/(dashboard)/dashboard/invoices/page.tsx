import React from 'react'
import { Plus } from 'lucide-react'

const InvoicesPage = () => {
  return (
    <div className="w-full p-6 border-2 border-dotted rounded-2xl overflow-auto">
      <div className='flex  w-full justify-between items-center mb-6'>
        <div>
          <h1 className="text-3xl font-bold ">Invoices</h1>
          <p>Your invoices will appear here.</p>
        </div>

        {/* button */}
        <button>
          <span className="text-white bg-black hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3.5 mr-2 mb-2">
            <Plus className="inline mr-2" />
            Create Invoice
          </span>
        </button>
      </div>


    </div>
  )
}

export default InvoicesPage