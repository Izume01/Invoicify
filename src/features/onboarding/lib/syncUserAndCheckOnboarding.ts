import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
export async function syncUserAndCheckOnboarding() {
    const user = await currentUser();

    if(!user) {
        return {
            redirect : '/',
            message: 'User not authenticated'
        }
    }

    let dbUser = await prisma.user.findUnique({
        where : {
            clerkId: user.id
        }
    })



    if(!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0]?.emailAddress || '',
                name: user.fullName || '',
                imageUrl: user.imageUrl || ''
            }
        })
    }

    if(!dbUser.IsonBoardingDone) {
        return {
            redirect: '/onboarding',
            message: 'User onboarding not complete'
        }
    }

    return {
        redirect : '/dashboard',
    }
}