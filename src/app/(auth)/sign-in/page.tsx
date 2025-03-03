'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/schemas/signInChema';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare, User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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

function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AnimatedBackground />
            <div className="w-16 h-16 relative mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-t-2 border-indigo-400 animate-spin animation-delay-150"></div>
                <div className="absolute inset-4 rounded-full border-t-2 border-cyan-400 animate-spin animation-delay-300"></div>
            </div>
            <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
    );
}

function SignInFormContent() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsLoading(true);

        try {
            const response = await signIn('credentials', {
                identifier: data.identifier,
                password: data.password,
                redirect: true,
                callbackUrl: '/dashboard'
            });

            if (response?.error) {
                toast({
                    title: 'Error',
                    description: response.error,
                    variant: 'destructive',
                });
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error('Sign in error:', error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-sm rounded-full mb-4 border border-violet-500/20">
                        <MessageSquare className="h-10 w-10 text-violet-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-6 shadow-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Email or Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input
                                                    placeholder="Enter your email or username"
                                                    className="pl-10 bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    className="pl-10 bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </span>
                                <span className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-center text-gray-400 mt-4">
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="text-violet-500 hover:text-violet-400 transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function SignInForm() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    if (status === 'authenticated') {
        return <LoadingSpinner />;
    }

    return <SignInFormContent />;
}