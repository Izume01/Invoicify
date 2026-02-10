import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireUserIdForPage(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}

export async function requireUserIdForApi(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError();
  }

  return userId;
}

export async function syncUserRecord(clerkUserId: string) {
  const clerkUser = await currentUser();

  return prisma.user.upsert({
    where: { clerkUserId },
    update: {
      email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
      name: clerkUser?.fullName ?? clerkUser?.firstName ?? null,
      imageUrl: clerkUser?.imageUrl ?? null,
    },
    create: {
      clerkUserId,
      email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
      name: clerkUser?.fullName ?? clerkUser?.firstName ?? null,
      imageUrl: clerkUser?.imageUrl ?? null,
    },
  });
}

export async function requireDbUserForApi() {
  const clerkUserId = await requireUserIdForApi();
  const dbUser = await syncUserRecord(clerkUserId);

  return { clerkUserId, dbUser };
}
