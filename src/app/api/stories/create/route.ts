import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { add } from 'date-fns';

// Schema for story creation
const storySchema = z.object({
    content: z.string().min(1, 'Story content is required').max(280, 'Story content cannot exceed 280 characters'),
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
            const { content } = storySchema.parse(body);

            // Create the story with 24-hour expiration
            const expiresAt = add(new Date(), { hours: 24 });

            const story = await prisma.story.create({
                data: {
                    id: crypto.randomUUID(),
                    content,
                    authorId: session.user.id,
                    expiresAt,
                },
                include: {
                    User: {
                        select: {
                            username: true,
                        }
                    },
                    Like: {
                        select: {
                            userId: true,
                        }
                    },
                    _count: {
                        select: {
                            Like: true,
                        }
                    }
                }
            });

            return Response.json(
                {
                    story: {
                        ...story,
                        likeCount: story._count.Like,
                        isLiked: false,
                        username: story.User.username,
                    },
                    success: true
                },
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
        console.error('Error creating story:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
} 