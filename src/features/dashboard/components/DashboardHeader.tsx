"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  return (
    <SignedIn>
      <header className="surface-soft mb-6 flex items-center justify-end rounded-2xl px-4 py-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </header>
    </SignedIn>
  );
}
