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
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

function UserDashboard() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
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
      const response = await axios.get<ApiResponse<Message[]>>('/api/get-messages');
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
  }, [session?.user?.id, toast]);

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
    }
  }, [session?.user?.id, fetchMessages, fetchAcceptMessages]);

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
                Share this link to receive anonymous messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex items-center p-3 bg-black/60 border border-gray-800 rounded-lg overflow-hidden">
                  <div className="flex-1 truncate text-gray-300">
                    {window.location.origin}/u/{session?.user?.username}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    className="ml-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
                  >
                    {isCopied ? (
                      'Copied!'
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">
                {acceptMessages
                  ? 'Anyone with this link can send you anonymous messages.'
                  : 'Enable "Accept Messages" to start receiving anonymous messages.'}
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-violet-400" />
            Your Messages
          </h2>
          <Button
            onClick={fetchMessages}
            variant="outline"
            size="sm"
            className="border-gray-700 bg-black/40 text-violet-300 hover:bg-black/60 hover:border-violet-500"
          >
            <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : 'hidden'}`} />
            Refresh
          </Button>
        </div>

        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-black/60 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No Messages Yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Share your profile link with friends to start receiving anonymous messages.
              </p>
              <Button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy Profile Link
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageCard message={message} onDelete={handleDeleteMessage} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default UserDashboard;