import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { channelSchema } from '@/schemas/channelSchema';
import { z } from 'zod';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return Response.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        const body = await request.json();

        try {
            const { name, slug } = channelSchema.parse(body);

            // Check if slug is already used by this user
            const existingChannel = await prisma.channel.findFirst({
                where: {
                    userId: session.user.id,
                    slug,
                },
            });

            if (existingChannel) {
                return Response.json(
                    { message: 'Channel with this slug already exists', success: false },
                    { status: 400 }
                );
            }

            // Create the channel
            const channel = await prisma.channel.create({
                data: {
                    name,
                    slug,
                    userId: session.user.id,
                },
            });

            return Response.json(
                { channel, success: true },
                { status: 201 }
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                return Response.json(
                    { message: error.errors[0].message, success: false },
                    { status: 400 }
                );
            }
            throw error;
        }
    } catch (error) {
        console.error('Error creating channel:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
} 