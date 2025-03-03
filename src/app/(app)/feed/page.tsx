'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storySchema, StoryFormValues } from '@/schemas/storySchema';
import { Story, StoryResponse } from '@/types/ApiResponse';
import axios from 'axios';
import { formatDistanceToNow, differenceInHours, differenceInMinutes } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    MessageSquare,
    Heart,
    Clock,
    User,
    Flame,
    RefreshCw,
    Send,
    ThumbsUp,
    Sparkles,
    Plus,
    X
} from 'lucide-react';
import Link from 'next/link';

// Animated gradient background component
const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-black/90" />
            <div className="absolute -inset-[10px] opacity-30">
                <div className="absolute top-0 left-0 right-0 h-[500px] rounded-full bg-gradient-to-r from-violet-600/30 via-cyan-400/30 to-indigo-500/30 blur-[100px] transform-gpu animate-pulse" />
                <div className="absolute bottom-0 right-0 left-0 h-[500px] rounded-full bg-gradient-to-r from-fuchsia-600/30 via-purple-400/30 to-violet-500/30 blur-[100px] transform-gpu animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        </div>
    );
};

// Story card component
const StoryCard = ({
    story,
    onLike
}: {
    story: Story,
    onLike: (storyId: string, action: 'like' | 'unlike') => Promise<void>
}) => {
    const timeLeft = () => {
        const now = new Date();
        const expiresAt = new Date(story.expiresAt);
        const hoursLeft = differenceInHours(expiresAt, now);

        if (hoursLeft > 0) {
            return `${hoursLeft}h left`;
        } else {
            const minutesLeft = differenceInMinutes(expiresAt, now);
            return `${minutesLeft}m left`;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="border-gray-800 bg-black/40 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-2 rounded-full">
                                <User className="h-4 w-4 text-violet-400" />
                            </div>
                            <span className="text-gray-300 font-medium">@{story.username || 'anonymous'}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{timeLeft()}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-3">
                    <p className="text-gray-200 whitespace-pre-wrap">{story.content}</p>
                    <div className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                    </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLike(story.id, story.isLiked ? 'unlike' : 'like')}
                        className={`text-sm flex items-center gap-1 ${story.isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                            }`}
                    >
                        {story.isLiked ? (
                            <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                        ) : (
                            <Heart className="h-4 w-4" />
                        )}
                        <span>{story.likeCount}</span>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

// Create Story Modal Component
const CreateStoryModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting
}: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (data: StoryFormValues) => Promise<void>,
    isSubmitting: boolean
}) => {
    const form = useForm<StoryFormValues>({
        resolver: zodResolver(storySchema),
        defaultValues: {
            content: '',
        },
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

    const handleSubmit = async (data: StoryFormValues) => {
        await onSubmit(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <Card className="border-gray-800 bg-black/90 backdrop-blur-sm shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-violet-400" />
                            Share Your Story
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="What's on your mind? Share it anonymously..."
                                                    className="resize-none min-h-[120px] bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                                                    {...field}
                                                    autoFocus
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        <Clock className="inline-block h-3 w-3 mr-1" />
                                        Disappears after 24 hours
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sharing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Share Story
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default function FeedPage() {
    const { data: session, status } = useSession();
    const [stories, setStories] = useState<Story[]>([]);
    const [activeTab, setActiveTab] = useState('new');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const fetchStories = useCallback(async (tab: string = activeTab) => {
        try {
            setIsRefreshing(true);
            const response = await axios.get<StoryResponse>(`/api/stories?sortBy=${tab}`);
            if (response.data.success && response.data.stories) {
                setStories(response.data.stories);
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch stories',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [activeTab, toast]);

    useEffect(() => {
        fetchStories(activeTab);
    }, [fetchStories, activeTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        fetchStories(value);
    };

    const handleLike = async (storyId: string, action: 'like' | 'unlike') => {
        if (status !== 'authenticated') {
            toast({
                title: 'Authentication Required',
                description: 'Please sign in to like stories',
                variant: 'destructive',
            });
            router.push('/sign-in');
            return;
        }

        try {
            const response = await axios.post('/api/stories/like', {
                storyId,
                action,
            });

            if (response.data.success) {
                // Update the stories state to reflect the like/unlike action
                setStories(prevStories =>
                    prevStories.map(story =>
                        story.id === storyId
                            ? {
                                ...story,
                                isLiked: action === 'like',
                                likeCount: action === 'like' ? story.likeCount + 1 : story.likeCount - 1,
                            }
                            : story
                    )
                );

                toast({
                    title: action === 'like' ? 'Story Liked' : 'Story Unliked',
                    description: response.data.message,
                    className: 'bg-black/80 border-violet-500 text-white',
                });
            }
        } catch (error) {
            console.error('Error liking/unliking story:', error);
            toast({
                title: 'Error',
                description: 'Failed to process your action',
                variant: 'destructive',
            });
        }
    };

    const onSubmit = async (data: StoryFormValues) => {
        if (status !== 'authenticated') {
            toast({
                title: 'Authentication Required',
                description: 'Please sign in to share a story',
                variant: 'destructive',
            });
            router.push('/sign-in');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/stories/create', data);

            if (response.data.success) {
                toast({
                    title: 'Story Shared',
                    description: 'Your story has been shared successfully!',
                    className: 'bg-black/80 border-violet-500 text-white',
                });

                // Add the new story to the list if we're on the "new" tab
                if (activeTab === 'new') {
                    setStories(prevStories => [response.data.story, ...prevStories]);
                }
            }
        } catch (error) {
            console.error('Error creating story:', error);
            toast({
                title: 'Error',
                description: 'Failed to share your story',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => {
        if (status !== 'authenticated') {
            toast({
                title: 'Authentication Required',
                description: 'Please sign in to share a story',
                variant: 'destructive',
            });
            router.push('/sign-in');
            return;
        }
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black/95">
                <AnimatedBackground />
                <div className="text-center">
                    <div className="w-16 h-16 relative mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-t-2 border-indigo-400 animate-spin animation-delay-150"></div>
                        <div className="absolute inset-4 rounded-full border-t-2 border-cyan-400 animate-spin animation-delay-300"></div>
                    </div>
                    <p className="text-gray-400">Loading stories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 relative min-h-screen">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-center"
            >
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200">
                    Anonymous Stories
                </h1>
                <p className="text-gray-400 max-w-md mx-auto">
                    Share your thoughts anonymously. Stories disappear after 24 hours.
                </p>
            </motion.div>

            <div className="max-w-2xl mx-auto mb-6">
                <div className="flex justify-between items-center mb-4">
                    <Tabs defaultValue="new" className="w-full" onValueChange={handleTabChange}>
                        <TabsList className="grid grid-cols-2 bg-black/40 border border-gray-800">
                            <TabsTrigger value="new" className="data-[state=active]:bg-violet-600/20">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                New Stories
                            </TabsTrigger>
                            <TabsTrigger value="hot" className="data-[state=active]:bg-violet-600/20">
                                <Flame className="h-4 w-4 mr-2" />
                                Hot Stories
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fetchStories(activeTab)}
                        disabled={isRefreshing}
                        className="ml-2 h-9 w-9 text-gray-400 hover:text-white hover:bg-black/40"
                        title="Refresh stories"
                    >
                        {isRefreshing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                <div className="space-y-4">
                    {stories.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg">
                            <MessageSquare className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-400 mb-2">No stories yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                Be the first to share your thoughts anonymously!
                            </p>
                            {status === 'authenticated' ? (
                                <Button
                                    onClick={openCreateModal}
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Share Your Story
                                </Button>
                            ) : (
                                <Link href="/sign-in">
                                    <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0">
                                        <User className="mr-2 h-4 w-4" />
                                        Sign In to Share
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <AnimatePresence>
                            {stories.map((story) => (
                                <StoryCard
                                    key={story.id}
                                    story={story}
                                    onLike={handleLike}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Floating Create Story Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
            >
                <Button
                    onClick={openCreateModal}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </motion.div>

            {/* Create Story Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <CreateStoryModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>
        </div>
    );
} 