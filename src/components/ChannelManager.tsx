'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { channelSchema } from '@/schemas/channelSchema';
import * as z from 'zod';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Hash,
    Plus,
    Trash2,
    Copy,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
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
} from '@/components/ui/alert-dialog';

type Channel = {
    id: string;
    name: string;
    slug: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

export function ChannelManager() {
    const { data: session } = useSession();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof channelSchema>>({
        resolver: zodResolver(channelSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    });

    const fetchChannels = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            const response = await axios.get('/api/channels');
            if (response.data.success) {
                setChannels(response.data.channels);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch channels',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.id, toast]);

    useEffect(() => {
        fetchChannels();
    }, [session?.user?.id, fetchChannels]);

    const onSubmit = async (data: z.infer<typeof channelSchema>) => {
        if (!session?.user?.id) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/channels/create', data);
            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: 'Channel created successfully!',
                    className: 'bg-black/80 border-violet-500 text-white',
                });
                form.reset();
                fetchChannels();
            }
        } catch (error: any) {
            console.error('Error creating channel:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create channel',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteChannel = async (channelId: string) => {
        if (!session?.user?.id) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete(`/api/channels/delete/${channelId}`);
            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: 'Channel deleted successfully!',
                    className: 'bg-black/80 border-violet-500 text-white',
                });
                fetchChannels();
            }
        } catch (error) {
            console.error('Error deleting channel:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete channel',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const copyChannelLink = (slug: string) => {
        if (!session?.user?.username) return;

        const url = `${window.location.origin}/u/${session.user.username}/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedChannel(slug);
        toast({
            title: 'Copied!',
            description: 'Channel link has been copied to clipboard.',
            className: 'bg-black/80 border-violet-500 text-white',
        });

        setTimeout(() => {
            setCopiedChannel(null);
        }, 2000);
    };

    if (isLoading) {
        return (
            <Card className="border-gray-800 bg-black/40 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Hash className="h-5 w-5 text-violet-400" />
                        Message Channels
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Create separate links for different groups
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-800 bg-black/40 backdrop-blur-sm shadow-lg">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Hash className="h-5 w-5 text-violet-400" />
                    Message Channels
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Create separate links for different groups to track where messages come from
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Channel Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Family, School, Work..."
                                                className="bg-black/60 border-gray-700 text-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 text-xs">
                                            A name to identify this channel
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Channel Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="family, school, work..."
                                                className="bg-black/60 border-gray-700 text-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 text-xs">
                                            Used in the URL: /u/{session?.user?.username}/{field.value || 'channel-slug'}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Channel
                                </>
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Your Channels</h3>
                    {channels.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-gray-700 rounded-md">
                            <Hash className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">No channels created yet</p>
                            <p className="text-gray-500 text-xs mt-1">Create your first channel above</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {channels.map((channel) => (
                                    <motion.div
                                        key={channel.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between p-3 bg-black/60 border border-gray-800 rounded-md"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-black/60 border-violet-500/50 text-violet-300">
                                                <Hash className="h-3 w-3 mr-1" />
                                                {channel.name}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs text-gray-400 mr-2 hidden sm:block">
                                                {window.location.origin}/u/{session?.user?.username}/{channel.slug}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => copyChannelLink(channel.slug)}
                                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-black/40"
                                            >
                                                {copiedChannel === channel.slug ? (
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-black/40"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-black/90 border-gray-800">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-white">Delete Channel</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-gray-400">
                                                            Are you sure you want to delete the &quot;{channel.name}&quot; channel? This will also delete all messages in this channel.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-transparent border-gray-700 text-gray-300 hover:bg-black/40 hover:text-white">
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteChannel(channel.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white"
                                                        >
                                                            {isDeleting ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Deleting...
                                                                </>
                                                            ) : (
                                                                'Delete'
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 