'use server';

import {getCurrentUser} from "@/lib/auth";
import {prisma} from "@/lib/prisma";


export async function deleteProduct(FormData: FormData) {
    const user = await getCurrentUser();
    const productId = FormData.get("productId") as string || "";

    await prisma.product.deleteMany({
        where: {id: productId, userId: user.id}
    });
}