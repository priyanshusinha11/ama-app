import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for like/unlike action
const likeSchema = z.object({
    storyId: z.string().min(1, 'Story ID is required'),
    action: z.enum(['like', 'unlike']),
});

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
            const { storyId, action } = likeSchema.parse(body);

            // Check if the story exists and hasn't expired
            const story = await prisma.story.findFirst({
                where: {
                    id: storyId,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
            });

            if (!story) {
                return Response.json(
                    { message: 'Story not found or has expired', success: false },
                    { status: 404 }
                );
            }

            if (action === 'like') {
                // Check if the user has already liked the story
                const existingLike = await prisma.like.findUnique({
                    where: {
                        storyId_userId: {
                            storyId,
                            userId: session.user.id,
                        },
                    },
                });

                if (existingLike) {
                    return Response.json(
                        { message: 'You have already liked this story', success: false },
                        { status: 400 }
                    );
                }

                // Create a new like
                await prisma.like.create({
                    data: {
                        id: crypto.randomUUID(),
                        storyId,
                        userId: session.user.id,
                    },
                });

                return Response.json(
                    { message: 'Story liked successfully', success: true },
                    { status: 200 }
                );
            } else {
                // Unlike the story
                await prisma.like.delete({
                    where: {
                        storyId_userId: {
                            storyId,
                            userId: session.user.id,
                        },
                    },
                });

                return Response.json(
                    { message: 'Story unliked successfully', success: true },
                    { status: 200 }
                );
            }
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
        console.error('Error processing like/unlike action:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
} 