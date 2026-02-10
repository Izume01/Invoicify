import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InvoiceActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <MoreHorizontal className="size-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Invoice Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="">View Invoice</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="">Edit Invoice</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="">Download Invoice</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild variant="destructive">
          <Link href="">Delete Invoice</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
