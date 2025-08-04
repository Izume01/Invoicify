import { syncUserAndCheckOnboarding } from "@/features/onboarding/lib/syncUserAndCheckOnboarding";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Hero from "@/features/home/components/Hero";
export default async function Home() {

  const user = await currentUser();

  if (user) {
    const {redirect : path} = await syncUserAndCheckOnboarding();
    
    if (path) {
      redirect(path);
    }
  }

  return (
    <div>
      <Hero />
    </div>  
  );
}
