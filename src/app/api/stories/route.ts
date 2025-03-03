import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const sortBy = searchParams.get('sortBy') || 'new'; // 'new' or 'hot'

        // Only fetch stories that haven't expired
        const now = new Date();

        let stories;

        if (sortBy === 'hot') {
            // Sort by most likes first
            stories = await prisma.story.findMany({
                where: {
                    expiresAt: {
                        gt: now,
                    },
                },
                orderBy: [
                    {
                        Like: {
                            _count: 'desc',
                        },
                    },
                    {
                        createdAt: 'desc',
                    },
                ],
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
        } else {
            // Sort by newest first (default)
            stories = await prisma.story.findMany({
                where: {
                    expiresAt: {
                        gt: now,
                    },
                },
                orderBy: {
                    createdAt: 'desc',
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
        }

        // Transform the stories to include like count and whether the current user has liked them
        const transformedStories = stories.map(story => ({
            id: story.id,
            content: story.content,
            createdAt: story.createdAt,
            expiresAt: story.expiresAt,
            authorId: story.authorId,
            username: story.User.username,
            likeCount: story._count.Like,
            isLiked: session?.user?.id
                ? story.Like.some(like => like.userId === session.user.id)
                : false,
        }));

        return Response.json(
            { stories: transformedStories, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching stories:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
} 