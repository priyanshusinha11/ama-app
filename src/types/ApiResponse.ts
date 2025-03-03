import { Message } from '@/types/prisma';

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    updatedUser?: {
        id: string;
        username: string;
        isAcceptingMessages: boolean;
    };
    messages?: Message[];
}