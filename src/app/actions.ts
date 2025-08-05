import prisma from "@/lib/prisma";
import { getRegisterUser } from "@/features/auth/hooks/getRegisterUser";

export async function createInvoice() {
    const {user , session} = await getRegisterUser();
}