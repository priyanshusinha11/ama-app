import { Message, MessageWithChannel, Channel } from '@/types/prisma';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    isAcceptingMessages?: boolean;
    updatedUser?: {
        id: string;
        username?: string;
        isAcceptingMessages: boolean;
    };
    messages?: MessageWithChannel[];
    channels?: Channel[];
}

// Specific response types for better type safety
export interface MessageResponse extends ApiResponse<MessageWithChannel[]> {
    messages: MessageWithChannel[];
}

export interface ChannelResponse extends ApiResponse<Channel[]> {
    channels: Channel[];
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
}