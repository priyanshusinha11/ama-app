import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const UsernameQuerySchema = z.object({
    username: z.string().min(1, "Username is required"),
});

export async function GET(request: Request) {
    console.log("API Route: /api/check-user-exists invoked.");
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        };
        console.log("API Route: Parsed username:", queryParams.username);

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            console.log("API Route: Username validation failed.");
            return Response.json(
                {
                    success: false,
                    message: "Invalid username parameter",
                },
                { status: 400 }
            );
        }

        const { username } = result.data;
        console.log(`API Route: Querying Prisma for username: ${username}`);

        const existingUser = await prisma.user.findFirst({
            where: {
                username,
            },
        });

        console.log("API Route: Prisma query result:", existingUser);

        if (existingUser) {
            console.log("API Route: User found. Returning success: true");
            return Response.json(
                {
                    success: true,
                    message: 'User exists',
                    isAcceptingMessages: existingUser.isAcceptingMessages
                },
                { status: 200 }
            );
        }

        console.log("API Route: User not found. Returning success: false");
        return Response.json(
            {
                success: false,
                message: 'User not found',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('API Route: Error checking if user exists:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking if user exists',
            },
            { status: 500 }
        );
    }
} 