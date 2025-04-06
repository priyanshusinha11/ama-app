import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

console.log("[Prisma Lib] Initializing Prisma Client setup...");

const prisma = globalThis.prisma || new PrismaClient({
    log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
    ],
});

console.log("[Prisma Lib] Prisma Client instance created/reused.");

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Optional: Add a connect check (might impact cold starts)
async function checkConnection() {
    console.log("[Prisma Lib] Checking Prisma connection...");
    try {
        await prisma.$connect();
        console.log("[Prisma Lib] Prisma Client connected successfully during check.");
    } catch (e) {
        console.error("[Prisma Lib] Prisma Client connection error during check:", e);
    } finally {
        // Disconnect only if we explicitly connected for the check
        // In serverless, rely on Prisma's implicit connection management
        // await prisma.$disconnect(); 
        console.log("[Prisma Lib] Prisma connection check complete.");
    }
}
// Uncomment the line below to enable the connection check during initialization
// checkConnection();


export { prisma }; 