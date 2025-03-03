'use client';
import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { messageSchema } from '@/schemas/messageSchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare, Sparkles, Send, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestButtonLoading, setIsSuggestButtonLoading] = useState(false);
  const [isUserValid, setIsUserValid] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();
  const [text, setText] = useState('');

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const watchContent = form.watch('content');

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const params = useParams<{ username: string }>();
  const specialChar = '||';

  useEffect(() => {
    // Check if user exists and is accepting messages
    const checkUser = async () => {
      try {
        const response = await axios.get(`/api/check-username-unique?username=${params.username}`);
        // If success is true, username is unique (doesn't exist)
        if (response.data.success) {
          setIsUserValid(false);
        }
        setIsPageLoading(false);
      } catch (error) {
        console.error('Error checking username:', error);
        setIsPageLoading(false);
      }
    };

    checkUser();
  }, [params.username]);

  const StringSplit = (sentence: string): string[] => {
    return sentence.split(specialChar);
  };

  async function onMessageSubmit(data: z.infer<typeof messageSchema>) {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/send-message', {
        username: params.username,
        content: data.content,
      });
      if (response.data.success) {
        toast({
          title: 'Message Sent!',
          description: 'Your anonymous message has been delivered successfully.',
        });
      }

      form.setValue('content', '');
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleTextMessage(data: string) {
    form.setValue('content', data);
  }

  async function onSuggestMessage() {
    setIsSuggestButtonLoading(true);
    try {
      const result = await axios.post('/api/suggest-messages');
      const response = result.data.message.candidates[0].content.parts[0].text;
      setText(response);
      toast({
        title: 'New Suggestions',
        description: 'Fresh message ideas have been generated for you!',
      });
      return response;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || "Failed to generate suggestions",
        variant: 'destructive',
      });
    } finally {
      setIsSuggestButtonLoading(false);
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isUserValid) {
    return (
      <div className="container mx-auto my-8 p-6 max-w-md text-center">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="p-3 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <UserIcon className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">User Not Found</h1>
          <p className="text-gray-600 mb-6">
            The user "{params.username}" doesn't exist or isn't accepting messages at this time.
          </p>
          <Link href="/sign-up">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Create Your Own Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto my-8 px-4 py-6 max-w-2xl"
    >
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
          <UserIcon className="h-10 w-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Send a Message to @{params.username}
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Your message will be completely anonymous. Feel free to share your thoughts!
        </p>
      </div>

      <Card className="mb-8 border-indigo-100 shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onMessageSubmit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Your Anonymous Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something nice, ask a question, or share your thoughts..."
                        className="resize-none min-h-[120px] bg-gray-50 border-gray-200 focus:border-indigo-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !watchContent}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            Message Ideas
          </h2>
          <Button
            onClick={onSuggestMessage}
            disabled={isSuggestButtonLoading}
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            {isSuggestButtonLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                New Ideas
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-gray-600">Click on any suggestion below to use it as your message.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {(text === '' ? StringSplit(initialMessageString) : StringSplit(text)).map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Button
                  className="w-full justify-start p-4 h-auto text-left bg-white border border-gray-200 hover:bg-gray-50 hover:border-indigo-200 text-gray-800 shadow-sm"
                  variant="outline"
                  onClick={() => handleTextMessage(data)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-indigo-500" />
                  <span className="line-clamp-2">{data}</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Want your own anonymous message board?</h3>
        <Link href="/sign-up">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Create Your Account
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default Page;
