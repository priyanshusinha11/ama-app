import { Message, MessageWithChannel, Channel, User } from '@/types/prisma';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    isAcceptingMessages?: boolean;
    updatedUser?: {
        id: string;
        username?: string;
        isAcceptingMessages: boolean;
    };
    messages?: MessageWithChannel[];
    channels?: Channel[];
    [key: string]: any;
}

// Specific response types for better type safety
export interface MessageResponse extends ApiResponse<MessageWithChannel[]> {
    messages: MessageWithChannel[];
}

export interface ChannelResponse extends ApiResponse<Channel[]> {
    channels: Channel[];
    channel?: Channel;
}

export interface UserResponse extends ApiResponse<{
    id: string;
    username?: string;
    isAcceptingMessages: boolean;
}> {
    updatedUser: {
        id: string;
        username?: string;
        isAcceptingMessages: boolean;
    };
    user?: User;
}

export interface Story {
    id: string;
    content: string;
    createdAt: Date;
    expiresAt: Date;
    authorId: string;
    username?: string;
    likeCount: number;
    isLiked: boolean;
}

export interface StoryResponse extends ApiResponse {
    stories?: Story[];
    story?: Story;
}