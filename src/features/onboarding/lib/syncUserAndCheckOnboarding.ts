import { auth } from "@clerk/nextjs/server";

import { syncUserRecord } from "@/lib/user";

export async function syncUserAndCheckOnboarding() {
  const { userId } = await auth();

  if (!userId) {
    return {
      redirect: "/",
      message: "User not authenticated",
    };
  }

  await syncUserRecord(userId);

  return {
    redirect: "/dashboard",
  };
}
