import { prisma } from './prisma';

async function testConnection() {
    try {
        // Try to count users as a simple test query
        const userCount = await prisma.user.count();
        console.log('Database connection successful!');
        console.log(`Number of users in database: ${userCount}`);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

testConnection(); 