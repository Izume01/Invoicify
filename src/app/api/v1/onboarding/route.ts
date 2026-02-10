import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Onboarding endpoint has been removed. Use /dashboard directly.",
    },
    { status: 410 },
  );
}
