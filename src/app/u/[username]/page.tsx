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
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { messageSchema } from '@/schemas/messageSchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare, Sparkles, Send, User as UserIcon, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        // Add a timestamp to force a fresh request, bypassing cache
        const timestamp = Date.now();
        const response = await axios.get(
          `/api/check-user-exists?username=${params.username}&t=${timestamp}`
        );
        // If success is true, user exists
        setIsUserValid(response.data.success);
        setIsPageLoading(false);
      } catch (error) {
        console.error('Error checking username:', error);
        // Ensure user is marked invalid on error
        setIsUserValid(false);
        setIsPageLoading(false);
      }
    };

    checkUser();
    // Keep dependency array as is, timestamp is generated inside the effect
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
          className: 'bg-black/80 border-violet-500 text-white',
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
        className: 'bg-black/80 border-violet-500 text-white',
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
      <div className="flex justify-center items-center min-h-screen bg-black/95">
        <AnimatedBackground />
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-indigo-400 animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 rounded-full border-t-2 border-cyan-400 animate-spin animation-delay-300"></div>
          </div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isUserValid) {
    return (
      <div className="container mx-auto my-8 p-6 max-w-md text-center min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-gray-800 w-full">
          <div className="p-4 bg-violet-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <UserIcon className="h-10 w-10 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white">User Not Found</h1>
          <p className="text-gray-400 text-center mb-6">
            &quot;Send me an anonymous message! I won&apos;t know who sent it&quot;
          </p>
          <Link href="/sign-up">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0">
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
      className="container mx-auto my-8 px-4 py-6 max-w-2xl relative min-h-screen"
    >
      <AnimatedBackground />

      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block p-4 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-sm rounded-full mb-4 border border-violet-500/20"
        >
          <UserIcon className="h-12 w-12 text-violet-400" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200"
        >
          Send a Message to @{params.username}
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-3 mb-4"
        >
          <Badge variant="outline" className="bg-black/40 border-violet-500/50 text-violet-300 backdrop-blur-sm">
            <Shield className="h-3 w-3 mr-1" /> Anonymous
          </Badge>
          <Badge variant="outline" className="bg-black/40 border-indigo-500/50 text-indigo-300 backdrop-blur-sm">
            <Lock className="h-3 w-3 mr-1" /> Encrypted
          </Badge>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-400 max-w-md mx-auto"
        >
          Your message will be completely anonymous. Feel free to share your thoughts!
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mb-8 border-gray-800 bg-black/40 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onMessageSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-medium">Your Anonymous Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write something nice, ask a question, or share your thoughts..."
                          className="resize-none min-h-[120px] bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading || !watchContent}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
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
                    </span>
                    <span className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-400" />
            Message Ideas
          </h2>
          <Button
            onClick={onSuggestMessage}
            disabled={isSuggestButtonLoading}
            variant="outline"
            className="border-gray-700 bg-black/40 text-violet-300 hover:bg-black/60 hover:border-violet-500"
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

        <p className="text-sm text-gray-500">Click on any suggestion below to use it as your message.</p>

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
                  className="w-full justify-start p-4 h-auto text-left bg-black/40 backdrop-blur-sm border border-gray-800 hover:bg-black/60 hover:border-violet-500 text-gray-300 shadow-sm group"
                  variant="outline"
                  onClick={() => handleTextMessage(data)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-violet-400 group-hover:text-violet-300" />
                  <span className="line-clamp-2">{data}</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <Separator className="my-10 bg-gray-800" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center"
      >
        <h3 className="text-lg font-medium text-white mb-4">Want your own anonymous message board?</h3>
        <Link href="/sign-up">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 relative overflow-hidden group">
            <span className="relative z-10">Create Your Account</span>
            <span className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default Page;
