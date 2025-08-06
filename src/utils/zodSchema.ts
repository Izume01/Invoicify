import {z} from "zod";

export const invoiceSchema = z.object({
    invoiceName: z.string().min(1, "Invoice name is required"),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceStatus: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
    
    currency: z.string().min(1, "Currency is required"),
    
    invoiceDate: z.string().min(1, "Invoice date is required"),
    invoiceDueDate: z.number().min(1, "Invoice due date is required"),
    paymentTerms: z.string().min(1, "Payment terms are required"),
    paymentMethod: z.string().min(1, "Payment method is required"),
    
    fromName: z.string().min(1, "Your name is required"),
    fromEmail: z.email("Invalid email format").min(1, "Your email is required"),
    fromAddress: z.string().min(1, "Your address is required"),

    ClientName: z.string().min(1, "Client name is required"),
    ClientEmail: z.email("Invalid email format").min(1, "Client email is required"),
    ClientAddress: z.string().min(1, "Client address is required"),

    invoiceItems: z.array(
        z.object({
            itemName: z.string().min(1, "Item name is required"),
            itemDescription: z.string().optional(),
            itemQuantity: z.number().min(1, "Item quantity must be at least 1"),
            itemPrice: z.number().min(0, "Item price must be a positive number"),
            itemTotal: z.number().min(0, "Item total must be a positive number")
        })
    ).min(1, "At least one invoice item is required"),

    subtotal: z.number().min(0, "Subtotal must be a positive number"),
    invoiceTotal: z.number().min(0, "Invoice total must be a positive number"),
    
    invoiceNote: z.string().optional(),
})