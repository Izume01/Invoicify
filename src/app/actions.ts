import * as z from "zod";

import prisma from "@/lib/prisma";
import { getRegisterUser } from "@/features/auth/hooks/getRegisterUser";
import { invoiceSchema } from "@/utils/zodSchema";

export async function createInvoice(formData : FormData) {
    const {user , session} = await getRegisterUser();


    if (!user || !session) {
        throw new Error("User not authenticated");
    }

    console.log("Data received from formData:", Object.fromEntries(formData));

}