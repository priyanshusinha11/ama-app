import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    const channelSlug = url.searchParams.get('channelSlug');

    if (!username || !channelSlug) {
        return Response.json(
            { message: 'Username and channelSlug are required', success: false },
            { status: 400 }
        );
    }

    try {
        // Find the user
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // Find the channel
        const channel = await prisma.channel.findFirst({
            where: {
                userId: user.id,
                slug: channelSlug,
            },
        });

        if (!channel) {
            return Response.json(
                { message: 'Channel not found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                channelName: channel.name,
                channelId: channel.id
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking channel:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
} 