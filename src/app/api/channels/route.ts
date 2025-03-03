import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return Response.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const channels = await prisma.channel.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return Response.json(
            { channels, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching channels:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
} 