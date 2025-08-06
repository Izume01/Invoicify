import * as z from "zod";

import prisma from "@/lib/prisma";
import { getRegisterUser } from "@/features/auth/hooks/getRegisterUser";
import { invoiceSchema } from "@/utils/zodSchema";

export async function createInvoice(formData : FormData) {
    const {user , session} = await getRegisterUser();

    const parseData = invoiceSchema.parseAsync(Object.fromEntries(formData));

    const {
        invoiceName,
        invoiceNumber,
        invoiceStatus,
        currency,
        invoiceDate,
        invoiceDueDate,
        paymentTerms,
        paymentMethod,
        fromName,
        fromEmail,
        fromAddress,
        ClientName,
        ClientEmail,
        ClientAddress,
        invoiceItems,
        subtotal,
        invoiceTotal,
        invoiceNote
    } = await parseData;

    console.log("Parsed Data" , {
        invoiceName,
        invoiceNumber,
        invoiceStatus,
        currency,
        invoiceDate,
        invoiceDueDate,
        paymentTerms,
        paymentMethod,
        fromName,
        fromEmail,
        fromAddress,
        ClientName,
        ClientEmail,
        ClientAddress,
        invoiceItems,
        subtotal,
        invoiceTotal,
        invoiceNote
    });
    
}