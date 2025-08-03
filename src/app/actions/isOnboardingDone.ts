'use server';

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function isOnboardingDone(): Promise<boolean> {
  try {
    const user = await currentUser();

    if (!user?.id) {
      console.warn("No current user found");
      return false;
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        IsonBoardingDone: true,
      },
    });

    return dbUser?.IsonBoardingDone ?? false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}
