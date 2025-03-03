'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types/prisma';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Link as LinkIcon, MessageSquare, Bell, BellOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = z.infer<typeof AcceptMessageSchema>;

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/sign-in');
    },
  });

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId));
  };

  const form = useForm<FormData>({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
      setValue('acceptMessages', false);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast, session?.user?.id]);

  const fetchMessages = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await axios.get<{ messages: Message[] }>('/api/get-messages');
      setMessages(response.data.messages);
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
  }, [toast, session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([fetchAcceptMessages(), fetchMessages()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [session?.user?.id, fetchAcceptMessages, fetchMessages]);

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) return;

    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: data.acceptMessages,
      });

      if (response.data.success) {
        toast({
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
      setValue('acceptMessages', !data.acceptMessages);
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${session?.user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto my-8 px-4 sm:px-6 max-w-4xl"
    >
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100">
        <h2 className="text-xl font-semibold mb-3 flex items-center text-indigo-800">
          <LinkIcon className="h-5 w-5 mr-2" />
          Your Profile Link
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Share this link with friends to receive anonymous messages
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="w-full p-3 pr-10 border border-indigo-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <Button
            onClick={copyToClipboard}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Your Messages</h1>
          <p className="text-gray-600">Manage all your anonymous messages in one place</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            onClick={() => fetchMessages()}
            variant="outline"
            size="sm"
            className="h-9 px-3 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex items-center space-x-3 bg-white p-2 px-4 rounded-full shadow-sm border border-gray-100">
            {acceptMessages ? (
              <Bell className="h-4 w-4 text-green-500" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            <Switch
              id="accept-messages"
              disabled={isSwitchLoading}
              checked={acceptMessages}
              onCheckedChange={(checked) => {
                setValue('acceptMessages', checked);
                onSubmit({ acceptMessages: checked });
              }}
              className="data-[state=checked]:bg-green-500"
            />
            <label htmlFor="accept-messages" className="text-sm font-medium cursor-pointer">
              {acceptMessages ? 'Accepting Messages' : 'Not Accepting Messages'}
            </label>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <AnimatePresence>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm"
          >
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No messages yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Share your profile link with friends to start receiving anonymous messages
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onDelete={handleDeleteMessage}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UserDashboard;