import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRegisterUser } from "@/features/auth/hooks/getRegisterUser";
import { invoiceSchema } from "@/utils/zodSchema";
import { z } from "zod";
import {
  CurrencySupported,
  InvoiceStatus,
  PaymentMethod,
} from "@prisma/client";
import { grantCreatorAccess } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  console.log("Route hit");
  const { user, session } = await getRegisterUser();

  if (!user || !session) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const requestData = await req.json();
    console.log("Raw request data:", requestData);

    const processedData = {
      ...requestData,
      date: requestData.date ? new Date(requestData.date) : null,
      dueDate: requestData.dueDate ? new Date(requestData.dueDate) : null,
    };

    const parsedData = invoiceSchema.parse(processedData);

    const currencyValue = parsedData.currency.toUpperCase();
    const paymentMethodValue = parsedData.paymentMethod.toUpperCase();

    const checkUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!checkUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const client = await prisma.client.create({
      data: {
        name: parsedData.clientName,
        email: parsedData.clientEmail,
        address: parsedData.clientAddress,
        city: "Unknown",
        state: "Unknown",
        zip: "00000",
        country: "Unknown",
        phone: "000-000-0000",
        website: "https://example.com",
        notes: "",
      },
    });

    // check if a invoice with the same number already exists
    const existingInvoice = await prisma.invoice.findUnique({
        where: { invoiceNumber: parsedData.invoiceNumber },
        });
    if (existingInvoice) {
      return NextResponse.json(
        { error: "Invoice with this number already exists" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceName: parsedData.invoiceName,
        invoiceNumber: parsedData.invoiceNumber,
        invoiceDate: parsedData.date,
        dueDate: parsedData.dueDate,
        currency: currencyValue as CurrencySupported,

        FromName: parsedData.fromName,
        FromEmail: parsedData.fromEmail,
        FromAddress: parsedData.fromAddress,

        ClientName: parsedData.clientName,
        ClientEmail: parsedData.clientEmail,
        ClientAddress: parsedData.clientAddress,

        status: InvoiceStatus.DRAFT,
        paymentMethod: paymentMethodValue as PaymentMethod,
        notes: parsedData.invoiceNote || "",

        cryptoAddress: parsedData.cryptoAddress || "",
        paypalEmail: parsedData.paypalEmail || "",

        bankAccountNumber: parsedData.bankName || "",
        bankName: parsedData.bankName || "",
        bankSwiftCode: parsedData.swiftCode || "",

        userId: checkUser.id,
        clientId: client.id,

        items: {
          create: parsedData.invoiceItemsList.map((item) => ({
            name: item.itemName,
            description: item.itemDescription || "",
            quantity: item.itemQuantity,
            unitPrice: item.itemPrice,
            total: item.itemQuantity * item.itemPrice,
          })),
        },
      },
    });

    // Grant creator full access (although ownership already provides this)
    await grantCreatorAccess();

    return NextResponse.json(
      { success: true, invoiceId: invoice.id },
      { status: 201 }
    );
  } catch (error) {
    console.log("API Validation error:", error);
    if (error instanceof z.ZodError) {
      console.log("Zod error details:", error.issues);
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
