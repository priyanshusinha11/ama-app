'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2, Clock } from 'lucide-react';
import { Message } from '@/types/prisma';
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';

dayjs.extend(relativeTime);

interface MessageCardProps {
    message: Message;
    onDelete: (messageId: string) => void;
}

export function MessageCard({ message, onDelete }: MessageCardProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message.id}`);
            if (response.data.success) {
                onDelete(message.id);
                toast({
                    description: response.data.message,
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    <p>{dayjs(message.createdAt).fromNow()}</p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">Delete Message</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                                Are you sure you want to delete this message? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 rounded-md"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
            </p>
        </motion.div>
    );
}