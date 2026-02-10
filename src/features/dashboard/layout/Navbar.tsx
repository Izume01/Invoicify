import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="surface-soft fixed inset-x-0 top-3 z-50 mx-auto flex w-[min(1120px,calc(100%-1rem))] items-center justify-between rounded-2xl px-4 py-3">
      <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
        Invoicify
      </Link>

      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="rounded-md px-2 py-1 transition-colors duration-200 hover:text-foreground">
          Home
        </Link>
        <Link href="/dashboard" className="rounded-md px-2 py-1 transition-colors duration-200 hover:text-foreground">
          Product
        </Link>

        <SignedOut>
          <SignInButton>
            <Button size="sm">Sign In</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
}
