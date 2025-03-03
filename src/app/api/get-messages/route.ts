import { prisma } from '@/lib/prisma';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                userId: _user._id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!messages) {
            return Response.json(
                { message: 'No messages found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages },
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