import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    const { username, content } = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessages) {
            return Response.json(
                { message: 'User is not accepting messages', success: false },
                { status: 403 }
            );
        }

        const newMessage = await prisma.message.create({
            data: {
                content,
                userId: user.id,
            },
        });

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}