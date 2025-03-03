'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types/prisma';
import { ApiResponse } from '@/types/ApiResponse';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import * as z from 'zod';
import axios from 'axios';
import {
  Copy,
  Link as LinkIcon,
  MessageSquare,
  Bell,
  BellOff,
  Loader2,
  User,
  Shield,
  Sparkles,
  ChevronRight,
  Hash,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChannelManager } from '@/components/ChannelManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type FormData = z.infer<typeof AcceptMessageSchema>;

type Channel = {
  id: string;
  name: string;
  slug: string;
};

type MessageWithChannel = Message & {
  channel: Channel | null;
};

function UserDashboard() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<MessageWithChannel[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [acceptMessages, setAcceptMessages] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { toast } = useToast();

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    window.location.href = '/sign-in';
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId)
    );
  };

  const fetchMessages = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const url = selectedChannelId
        ? `/api/get-messages?channelId=${selectedChannelId}`
        : '/api/get-messages';

      const response = await axios.get<ApiResponse<MessageWithChannel[]>>(url);
      if (response.data.success && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, toast, selectedChannelId]);

  const fetchChannels = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await axios.get('/api/channels');
      if (response.data.success) {
        setChannels(response.data.channels);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }, [session?.user?.id]);

  const fetchAcceptMessages = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await axios.get<ApiResponse<boolean>>('/api/accept-messages');
      if (response.data.success) {
        setAcceptMessages(response.data.isAcceptingMessages ?? false);
      }
    } catch (error) {
      console.error('Error fetching accept messages status:', error);
    }
  }, [session?.user?.id]);

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: data.acceptMessages,
      });

      if (response.data.success) {
        setAcceptMessages(data.acceptMessages);
        toast({
          title: 'Success',
          description: data.acceptMessages
            ? 'You are now accepting messages!'
            : 'You are no longer accepting messages.',
          className: 'bg-black/80 border-violet-500 text-white',
        });
      }
    } catch (error) {
      console.error('Error updating accept messages setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchMessages();
      fetchAcceptMessages();
      fetchChannels();
    }
  }, [session?.user?.id, fetchMessages, fetchAcceptMessages, fetchChannels]);

  const copyToClipboard = () => {
    if (!session?.user?.username) return;

    const url = `${window.location.origin}/u/${session.user.username}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast({
      title: 'Copied!',
      description: 'Your profile link has been copied to clipboard.',
      className: 'bg-black/80 border-violet-500 text-white',
    });

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleChannelChange = (value: string) => {
    setSelectedChannelId(value === 'all' ? null : value === 'none' ? 'none' : value);
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChannelId, fetchMessages]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black/95">
        <AnimatedBackground />
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-indigo-400 animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 rounded-full border-t-2 border-cyan-400 animate-spin animation-delay-300"></div>
          </div>
          <p className="text-gray-400">Loading your dashboard...</p>
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
        className="mb-8 text-center"
      >
        <div className="inline-block p-4 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-sm rounded-full mb-4 border border-violet-500/20">
          <User className="h-12 w-12 text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200">
          Welcome, {session?.user?.username || 'User'}
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Manage your messages and profile settings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card className="border-gray-800 bg-black/40 backdrop-blur-sm shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-violet-400" />
                Your Profile
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your anonymous messaging settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {acceptMessages ? (
                    <Bell className="h-5 w-5 text-green-400" />
                  ) : (
                    <BellOff className="h-5 w-5 text-red-400" />
                  )}
                  <span className="text-gray-300">Accept Messages</span>
                </div>
                <Switch
                  checked={acceptMessages}
                  onCheckedChange={(checked) => {
                    onSubmit({ acceptMessages: checked });
                  }}
                  disabled={isSubmitting}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-400 mb-2">
                  {acceptMessages
                    ? 'You are currently accepting anonymous messages.'
                    : 'You are not accepting anonymous messages.'}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="bg-black/40 border-violet-500/50 text-violet-300 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                {messages.length} {messages.length === 1 ? 'message' : 'messages'} received
              </Badge>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Share Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="border-gray-800 bg-black/40 backdrop-blur-sm shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-violet-400" />
                Share Your Profile
              </CardTitle>
              <CardDescription className="text-gray-400">
                Share your profile link to receive anonymous messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/60 p-3 rounded-md border border-gray-800 flex items-center justify-between">
                <div className="truncate text-gray-300 text-sm">
                  {window.location.origin}/u/{session?.user?.username}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-2 text-gray-400 hover:text-white hover:bg-black/40"
                >
                  {isCopied ? (
                    <span className="text-green-400 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Share this link with anyone you want to receive anonymous messages from. They won't know who you are unless you tell them.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Channel Manager */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <ChannelManager />
      </motion.div>

      {/* Messages Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-gray-800 bg-black/40 backdrop-blur-sm shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-violet-400" />
                Your Messages
              </CardTitle>
              <CardDescription className="text-gray-400">
                View and manage your received messages
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select onValueChange={handleChannelChange} defaultValue="all">
                <SelectTrigger className="w-[180px] bg-black/60 border-gray-700 text-gray-300">
                  <SelectValue placeholder="Filter by channel" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  <SelectItem value="all">All messages</SelectItem>
                  <SelectItem value="none">No channel</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg">
                <MessageSquare className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No messages yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Share your profile link with others to start receiving anonymous messages.
                </p>
                <Button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Profile Link
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageCard
                        message={message}
                        onDelete={handleDeleteMessage}
                        channel={message.channel}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default UserDashboard;