import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
    request: Request,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                userId: _user.id
            }
        });

        if (!message) {
            return Response.json(
                { message: 'Message not found or unauthorized', success: false },
                { status: 404 }
            );
        }

        await prisma.message.delete({
            where: {
                id: messageId
            }
        });

        return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );
    }
}