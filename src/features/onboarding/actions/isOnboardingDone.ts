"use server";

import { auth } from "@clerk/nextjs/server";

export async function isOnboardingDone(): Promise<boolean> {
  const { userId } = await auth();
  return Boolean(userId);
}
