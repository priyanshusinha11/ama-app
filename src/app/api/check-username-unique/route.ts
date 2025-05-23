import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

export const dynamic = 'force-dynamic';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        };

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
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
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}