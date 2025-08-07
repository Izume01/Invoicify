import { InvoiceAccessType } from "@prisma/client";
import prisma from "@/lib/prisma";

/**
 * Check if a user has specific access to an invoice
 */
export async function hasInvoiceAccess(
  userId: number,
  invoiceId: number,
  accessType: InvoiceAccessType
): Promise<boolean> {
  try {
    // Check if user is the owner of the invoice (has full access)
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: userId,
      },
    });

    if (invoice) {
      return true; // Owner has all permissions
    }

    // Check if user has explicit access via InvoiceAccess
    const access = await prisma.invoiceAccess.findFirst({
      where: {
        invoiceId: invoiceId,
        userId: userId,
        accessType: accessType,
      },
    });

    return !!access;
  } catch (error) {
    console.error("Error checking invoice access:", error);
    return false;
  }
}

/**
 * Get all access types that a user has for a specific invoice
 */
export async function getUserInvoicePermissions(
  userId: number,
  invoiceId: number
): Promise<InvoiceAccessType[]> {
  try {
    // Check if user is the owner of the invoice (has full access)
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: userId,
      },
    });

    if (invoice) {
      return [InvoiceAccessType.VIEW, InvoiceAccessType.EDIT, InvoiceAccessType.DELETE];
    }

    // Get explicit access permissions
    const accesses = await prisma.invoiceAccess.findMany({
      where: {
        invoiceId: invoiceId,
        userId: userId,
      },
      select: {
        accessType: true,
      },
    });

    return accesses.map((access) => access.accessType);
  } catch (error) {
    console.error("Error getting user invoice permissions:", error);
    return [];
  }
}

/**
 * Get all invoices that a user has access to with their permission levels
 */
export async function getUserAccessibleInvoices(userId: number) {
  try {
    // Get invoices owned by the user
    const ownedInvoices = await prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      include: {
        client: true,
        items: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    // Get invoices shared with the user
    const sharedInvoices = await prisma.invoice.findMany({
      where: {
        accesses: {
          some: {
            userId: userId,
          },
        },
        userId: {
          not: userId, // Exclude owned invoices to avoid duplicates
        },
      },
      include: {
        client: true,
        items: true,
        accesses: {
          where: {
            userId: userId,
          },
          select: {
            accessType: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    // Format the results with permission information
    const ownedInvoicesWithPermissions = ownedInvoices.map((invoice) => ({
      ...invoice,
      userPermissions: [InvoiceAccessType.VIEW, InvoiceAccessType.EDIT, InvoiceAccessType.DELETE],
      isOwner: true,
    }));

    const sharedInvoicesWithPermissions = sharedInvoices.map((invoice) => ({
      ...invoice,
      userPermissions: invoice.accesses.map((access) => access.accessType),
      isOwner: false,
    }));

    return [...ownedInvoicesWithPermissions, ...sharedInvoicesWithPermissions];
  } catch (error) {
    console.error("Error getting user accessible invoices:", error);
    return [];
  }
}

/**
 * Grant full access to the invoice creator
 */
export async function grantCreatorAccess() {
  try {
    // The creator automatically gets full access as the owner
    // No need to create InvoiceAccess records for the owner
    // since ownership is determined by the userId field on the Invoice
    return true;
  } catch (error) {
    console.error("Error granting creator access:", error);
    return false;
  }
}

/**
 * Share an invoice with another user with specific permissions
 */
export async function shareInvoice(
  invoiceId: number,
  targetUserId: number,
  accessTypes: InvoiceAccessType[]
) {
  try {
    // Remove existing access records for this user and invoice
    await prisma.invoiceAccess.deleteMany({
      where: {
        invoiceId: invoiceId,
        userId: targetUserId,
      },
    });

    // Create new access records
    const accessRecords = accessTypes.map((accessType) => ({
      invoiceId: invoiceId,
      userId: targetUserId,
      accessType: accessType,
    }));

    await prisma.invoiceAccess.createMany({
      data: accessRecords,
    });

    return true;
  } catch (error) {
    console.error("Error sharing invoice:", error);
    return false;
  }
}