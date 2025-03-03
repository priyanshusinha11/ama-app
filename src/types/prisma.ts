import { Message as PrismaMessage, User as PrismaUser } from '@prisma/client';

export type Message = PrismaMessage;
export type User = PrismaUser;

// Additional type utilities if needed
export type MessageWithUser = Message & {
    user: User;
}; 