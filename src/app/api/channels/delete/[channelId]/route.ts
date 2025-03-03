import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return Response.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const { channelId } = params;

        // Check if channel exists and belongs to the user
        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                userId: session.user.id,
            },
        });

        if (!channel) {
            return Response.json(
                { message: 'Channel not found', success: false },
                { status: 404 }
            );
        }

        // Delete all messages in the channel
        await prisma.message.deleteMany({
            where: {
                channelId,
            },
        });

        // Delete the channel
        await prisma.channel.delete({
            where: {
                id: channelId,
            },
        });

        return Response.json(
            { message: 'Channel deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting channel:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
} 