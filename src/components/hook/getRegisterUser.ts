import { auth , currentUser } from "@clerk/nextjs/server";

export async function getRegisterUser() {
    const user = await currentUser();
    const session = await auth();

    if (!user) {
        throw new Error("User not authenticated");
    }
    if (!session) {
        throw new Error("Session not found");
    }

    return {
        user: user, session: session
    }
}