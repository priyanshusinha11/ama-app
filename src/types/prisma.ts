import { Message as PrismaMessage, User as PrismaUser, Channel as PrismaChannel, Story as PrismaStory, Like as PrismaLike } from '@prisma/client';

export type Message = PrismaMessage;
export type User = PrismaUser;
export type Channel = PrismaChannel;
export type Story = PrismaStory;
export type Like = PrismaLike;

// Additional type utilities if needed
export type MessageWithUser = Message & {
    user: User;
};

export type StoryWithUser = Story & {
    user: Pick<User, 'username'>;
    _count?: {
        likes: number;
    };
    hasLiked?: boolean;
};

// Type for messages with channel information
export type MessageWithChannel = Message & {
    channel: Channel | null;
}; 