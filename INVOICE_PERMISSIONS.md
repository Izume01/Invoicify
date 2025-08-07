# Invoice Permission System

This document explains how the invoice permission system works in Invoicify.

## Overview

The permission system restricts access to invoices based on user roles and explicit permissions. There are two types of access:

1. **Owner Access**: Users who created the invoice have full access (VIEW, EDIT, DELETE)
2. **Shared Access**: Users explicitly granted specific permissions via the InvoiceAccess table

## Database Schema

### InvoiceAccessType Enum
```typescript
enum InvoiceAccessType {
  VIEW    // Can view invoice details
  EDIT    // Can modify invoice (includes VIEW)
  DELETE  // Can delete invoice (includes VIEW)
}
```

### Models
- **Invoice**: Contains `userId` field linking to the owner
- **InvoiceAccess**: Junction table for shared permissions
- **User**: Related to both owned and accessible invoices

## API Endpoints

### GET /api/v1/invoices
Fetches all invoices the current user has access to.
- Returns owned invoices + shared invoices
- Each invoice includes `userPermissions[]` and `isOwner` flag

### GET /api/v1/invoices/[id]
Fetches a specific invoice with permission validation.
- Requires at least VIEW permission
- Returns 403 if no access
- Includes full invoice details and user permissions

### POST /api/v1/invoices/[id]/share
Shares an invoice with another user (owner only).
```typescript
{
  "targetUserEmail": "user@example.com",
  "accessTypes": ["VIEW", "EDIT"]
}
```

### POST /api/v1/create
Creates a new invoice and automatically grants creator ownership.

## Permission Functions

### hasInvoiceAccess(userId, invoiceId, accessType)
Checks if a user has specific access to an invoice.

### getUserInvoicePermissions(userId, invoiceId)
Returns all permission types a user has for an invoice.

### getUserAccessibleInvoices(userId)
Returns all invoices a user can access with permission metadata.

### shareInvoice(invoiceId, targetUserId, accessTypes)
Grants specific permissions to a user for an invoice.

## UI Components

### InvoiceList
- Fetches real invoice data from API
- Shows user's access level (Owner vs specific permissions)
- Displays appropriate actions based on permissions

### InvoiceActions
- Conditionally shows actions based on user permissions
- VIEW: View, Download
- EDIT: + Edit, Mark as Paid
- DELETE: + Delete
- OWNER: + Share

## Permission Logic

```typescript
// Owner has all permissions
if (invoice.userId === currentUserId) {
  return [VIEW, EDIT, DELETE];
}

// Check explicit permissions
const permissions = await InvoiceAccess.findMany({
  where: { invoiceId, userId: currentUserId }
});
```

## Security Features

1. **API Validation**: All endpoints validate permissions before returning data
2. **UI Restrictions**: Actions are hidden if user lacks permissions
3. **Owner-Only Actions**: Only owners can share invoices
4. **Automatic Ownership**: Invoice creators automatically get full access

## Usage Examples

### Sharing an Invoice
```typescript
// POST /api/v1/invoices/123/share
{
  "targetUserEmail": "colleague@company.com",
  "accessTypes": ["VIEW", "EDIT"]
}
```

### Checking Access in Code
```typescript
const canEdit = await hasInvoiceAccess(userId, invoiceId, InvoiceAccessType.EDIT);
if (!canEdit) {
  return res.status(403).json({ error: "Access denied" });
}
```

### UI Permission Checks
```typescript
const canEdit = isOwner || userPermissions.includes(InvoiceAccessType.EDIT);
return (
  <div>
    {canEdit && <EditButton />}
    {canDelete && <DeleteButton />}
  </div>
);
```