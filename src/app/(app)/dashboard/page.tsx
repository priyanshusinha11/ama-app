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
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { z } from 'zod';

type FormData = z.infer<typeof AcceptMessageSchema>;

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const { data: session, status } = useSession();

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
    if (!session?.user) return;

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
  }, [setValue, toast, session?.user]);

  const fetchMessages = useCallback(async () => {
    if (!session?.user) return;

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
  }, [toast, session?.user]);

  useEffect(() => {
    if (session?.user) {
      fetchAcceptMessages();
      fetchMessages();
    }
  }, [session?.user, fetchAcceptMessages, fetchMessages]);

  const onSubmit = async (data: FormData) => {
    if (!session?.user) return;

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

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${session.user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Your Profile Link</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 p-2 border rounded"
          />
          <Button onClick={copyToClipboard} variant="outline">
            Copy
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Messages</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => fetchMessages()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="accept-messages"
              disabled={isSwitchLoading}
              checked={acceptMessages}
              onCheckedChange={(checked) => {
                setValue('acceptMessages', checked);
                onSubmit({ acceptMessages: checked });
              }}
            />
            <label htmlFor="accept-messages">Accept Messages</label>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No messages yet</p>
        </div>
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
    </div>
  );
}

export default UserDashboard;