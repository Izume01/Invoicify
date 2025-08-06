import {z} from "zod";

export const invoiceSchema = z.object({
    invoiceName : z.string().min(1, "Invoice name is required"),
    invoiceNumber : z.string().min(1, "Invoice number is required"),

    currency : z.string().min(1, "Currency is required"),


    // Dates 

    date : z.date({
        message: "Invoice date is required"
    }).refine(date  => date <= new Date() , {
        message: "Invoice date cannot be in the future"
    }),

    dueDate : z.date({
        message: "Due date is required"
    }).refine(date => date > new Date(), {
        message: "Due date must be in the future"
    }),

    // Payment terms
    paymentTerms : z.string().min(1, "Payment terms are required"),
    paymentMethod : z.string().min(1, "Payment method is required"),

    fromName : z.string().min(1, "From name is required"),
    fromEmail : z.email("Invalid email format").min(1, "From email is required"),
    fromAddress : z.string().min(1, "From address is required"),

    clientName : z.string().min(1, "Client name is required"),
    clientEmail : z.email("Invalid email format").min(1, "Client email is required"),
    clientAddress : z.string().min(1, "Client address is required"),

    // Conditional Payment fields 

    cryptoAddress : z.string().optional(),
    accountNumber : z.string().optional(),
    swiftCode : z.string().optional(),
    bankName : z.string().optional(),
    paypalEmail : z.email("Invalid email format").optional(),


    invoiceItemsList : z.array(
        z.object({
            itemName: z.string().min(1, "Item name is required"),
            itemDescription: z.string().optional(),
            itemQuantity: z.number().min(1, "Item quantity must be at least 1"),
            itemPrice: z.number().min(0, "Item price cannot be negative"),
        })
    ).min(1, "At least one invoice item is required"),

    invoiceNote: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === "crypto") {
        return data.cryptoAddress && data.cryptoAddress.length > 0;
    }
    return true;
 } , {
    message: "Crypto address is required for crypto payment method",
    path: ["cryptoAddress"]
 }).refine(data => {
    if(data.paymentMethod === "bank") {
        return data.accountNumber && data.accountNumber.length > 0 && data.swiftCode && data.swiftCode.length > 0 && data.bankName && data.bankName.length > 0;
    }

    return true
 } , {
    message: "Account number, SWIFT code, and bank name are required for bank payment method",
    path: ["accountNumber", "swiftCode", "bankName"]
 }).refine(data => {
    if(data.paymentMethod === "paypal") {
        return data.paypalEmail && data.paypalEmail.length > 0;
    }
    return true;
 }, {
    message: "PayPal email is required for PayPal payment method",
    path: ["paypalEmail"]
 });