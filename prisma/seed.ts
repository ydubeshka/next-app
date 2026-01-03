import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const demoUserId = 'ac465361-063a-449f-abe9-33d6f54f7127';
    //Create sample products
    await prisma.product.createMany({
        data: Array.from({length: 25}).map((_, index) => ({
            userId: demoUserId,
            name: `Product ${index + 1}`,
            price: Math.random()*90 +10, // Random price between 10 and 100
            quantity: Math.floor(Math.random()*20),
            lowStockAt:5,
            createdAt: new Date(Date.now() - 100 * 60 * 60 * 24 * (index + 5)),
        })),
    });

    console.log('Sample products created successfully.');
    console.log(`User ID for reference: ${demoUserId}`);
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })