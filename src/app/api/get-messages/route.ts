import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const url = new URL(request.url);
    const channelId = url.searchParams.get('channelId');

    if (!session?.user?.id) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const whereClause: any = {
            userId: session.user.id
        };

        // If channelId is provided, filter by channel
        if (channelId) {
            whereClause.channelId = channelId;
        } else if (channelId === null) {
            // If channelId is explicitly null, show only messages without a channel
            whereClause.channelId = null;
        }
        // If channelId is undefined, show all messages

        const messages = await prisma.message.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                channel: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        if (!messages) {
            return Response.json(
                { message: 'No messages found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Messages retrieved successfully',
                messages
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}