import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

/**
 * This route handles the onboarding process for users.
 * It expects a POST request with a JSON body containing the user's answers.
 * The answers are saved to the database and the user's onboarding status is updated.
 */

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { answer } = body;

    if (!answer) {
        return new Response(JSON.stringify({ message: 'Answer is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Here you would typically save the answers to a database
     * First we will forLoop through the answers and log them
     * and then save them with choice1 choice2 etc
     */

    try {
        const user = await currentUser();

        const userId = user?.id;

        const dbUser = await prisma.user.findUnique({
            where: {
                clerkId: userId || "",
            }
        })

        if (!dbUser) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }   

        const [choice1, choice2, choice3, choice4] = answer;


        console.log("User's answers:", choice1, choice2, choice3, choice4);
        

        const onboarding = await prisma.onBoarding.create({
            data: {
                option1: choice1,
                option2: choice2,
                option3: choice3,
                option4: choice4,
            },
        });

        await prisma.user.update({
            where: {
                clerkId: userId || "",
            },
            data: {
                IsonBoardingDone: true,
                onBoardingId : onboarding.id,
            },
        });

        return new Response(JSON.stringify({ message: 'Onboarding completed successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Error during onboarding:', err);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        await prisma.$disconnect();
    }
}