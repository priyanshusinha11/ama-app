'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInChema';
import { Suspense, useEffect, useState } from 'react';
import { Loader2, MessageSquare, User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

// This component uses useSearchParams which requires Suspense
function SignInFormContent() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push('/dashboard');
        }
    }, [session, status, router]);

    const { toast } = useToast();
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    toast({
                        title: 'Login Failed',
                        description: 'Incorrect username or password',
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: result.error,
                        variant: 'destructive',
                    });
                }
                setIsLoading(false);
            }

            if (!result?.error) {
                // Wait for session to be updated
                toast({
                    title: 'Success',
                    description: 'Signed in successfully',
                });
                // Router will handle redirect in the useEffect
            }
        } catch (error) {
            console.error('Sign in error:', error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    // Don't render anything until mounted to prevent hydration errors
    if (!mounted) {
        return null;
    }

    if (status === 'loading') {
        return <LoadingSpinner />;
    }

    if (status === 'authenticated') {
        return <LoadingSpinner />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-100"
        >
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-indigo-100 rounded-full">
                        <MessageSquare className="h-10 w-10 text-indigo-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                    Welcome Back
                </h1>
                <p className="text-gray-600 mb-6">
                    Sign in to continue your anonymous messaging journey
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        name="identifier"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Email or Username</FormLabel>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        {...field}
                                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:bg-white"
                                        placeholder="Enter your email or username"
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Password</FormLabel>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type="password"
                                        {...field}
                                        className="pl-10 py-2 bg-gray-50 border-gray-200 focus:bg-white"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 h-11'
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
            </Form>
            <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                    Not a member yet?{' '}
                    <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Create an account
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

// Main component wrapped in Suspense
export default function SignInForm() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-12">
                <SignInFormContent />
            </div>
        </Suspense>
    );
}