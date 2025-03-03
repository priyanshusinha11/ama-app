import { Message } from '@/types/prisma';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    isAcceptingMessages?: boolean;
    updatedUser?: {
        id: string;
        username: string;
        isAcceptingMessages: boolean;
    };
    messages?: Message[];
}