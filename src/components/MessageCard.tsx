'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2, Clock, MessageSquare } from 'lucide-react';
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
                    title: 'Message Deleted',
                    description: 'The message has been permanently removed.',
                    className: 'bg-black/80 border-violet-500 text-white',
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative"
        >
            <div className="p-5 rounded-lg border border-gray-800 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 shadow-lg hover:shadow-violet-900/10">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-sm border border-violet-500/20 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-violet-400" />
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{dayjs(message.createdAt).fromNow()}</span>
                        </div>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/80 backdrop-blur-md border-gray-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                    This action cannot be undone. This will permanently delete the
                                    message from your inbox.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-black/60 border-gray-700 text-gray-300 hover:bg-black/40 hover:text-white">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="pl-2 border-l-2 border-violet-500/30">
                    <p className="text-gray-300 whitespace-pre-wrap">{message.content}</p>
                </div>

                <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-violet-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
        </motion.div>
    );
}