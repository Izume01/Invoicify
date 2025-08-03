import Hero from "@/components/pages/Hero";
import { syncUserAndCheckOnboarding } from "@/lib/syncUserAndCheckOnboarding";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
