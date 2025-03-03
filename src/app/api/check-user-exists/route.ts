import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const UsernameQuerySchema = z.object({
    username: z.string().min(1, "Username is required"),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        };

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid username parameter",
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingUser = await prisma.user.findFirst({
            where: {
                username,
            },
        });

        if (existingUser) {
            return Response.json(
                {
                    success: true,
                    message: 'User exists',
                    isAcceptingMessages: existingUser.isAcceptingMessages
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: false,
                message: 'User not found',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking if user exists',
            },
            { status: 500 }
        );
    }
} 