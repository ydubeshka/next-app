'use server';

import {getCurrentUser} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import { z } from 'zod';
import {redirect} from "next/navigation";


const ProductSchema = z.object({
    name: z.string().min(3, "Name is required"),
    price: z.coerce.number().nonnegative("Price must be non-negative"),
    sku: z.string().optional(),
    lowStockAt: z.coerce.number().int().min(0).optional()
})

export async function deleteProduct(formData: FormData) {
    const user = await getCurrentUser();
    const productId = formData.get("productId") as string || "";

    await prisma.product.deleteMany({
        where: {id: productId, userId: user.id}
    });
}

export async function createProduct(formData: FormData) {
    const user = await getCurrentUser();
    const parsed = ProductSchema.safeParse({
        name: formData.get('name'),
        price: formData.get('price'),
        quantity: formData.get('quantity'),
        sku: formData.get('sku') || undefined,
        lowStockAt: formData.get('lowStockAt') || undefined,
    });

    if (!parsed.success) {
        throw new Error("Validation failed");
    }

    try {
        await prisma.product.create({
            data: {...parsed.data, userId: user.id},
        })
    }
    catch (e) {
        throw new Error(`Failed to create product\n ${e}`);
    }
    redirect('/inventory')
}