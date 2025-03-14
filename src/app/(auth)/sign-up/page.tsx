'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from "usehooks-ts";
import * as z from 'zod';
import Image from 'next/image';

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
import axios, { AxiosError } from 'axios';
import { Loader2, MessageSquare, User, Mail, Lock, ArrowRight, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

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

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage(''); // Reset message
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-username-unique?username=${username}`
                    );
                    setUsernameMessage(response.data.message || 'Username check completed');
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? 'Error checking username'
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    // Modify the success handler in the `onSubmit` function
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);

            toast({
                title: 'Account Created!',
                description: 'Welcome to CryptiCat. Your purr-sonal journey begins meow!',
                className: 'bg-black/80 border-violet-500 text-white',
            });

            // Sign in the user automatically after successful registration
            await signIn('credentials', {
                identifier: data.username,
                password: data.password,
                redirect: true,
                callbackUrl: '/feed'
            });

            // No need to set isSubmitting to false here as we're redirecting
        } catch (error) {
            console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            let errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                variant: 'destructive',
            });

            setIsSubmitting(false);
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
                    <Image
                        src="/bg-free-cat.png"
                        alt="CryptiCat Logo"
                        width={60}
                        height={60}
                        className="h-16 w-16 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200">
                        Join the CryptiCat Pride
                    </h1>
                    <p className="text-gray-400">
                        Create your account to start your stealthy, anonymous adventure
                    </p>
                </div>

                <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-6 shadow-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input
                                                    {...field}
                                                    className="pl-10 bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                                                    placeholder="Choose a unique username"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        debounced(e.target.value);
                                                    }}
                                                />
                                                {isCheckingUsername && (
                                                    <div className="absolute right-3 top-3">
                                                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                                    </div>
                                                )}
                                                {!isCheckingUsername && usernameMessage && (
                                                    <div className="absolute right-3 top-3">
                                                        {usernameMessage === 'Username is unique' ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        {!isCheckingUsername && usernameMessage && (
                                            <p
                                                className={`text-xs mt-1 ${usernameMessage === 'Username is unique'
                                                    ? 'text-green-500'
                                                    : 'text-red-400'
                                                    }`}
                                            >
                                                {usernameMessage}
                                            </p>
                                        )}
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input
                                                    {...field}
                                                    name="email"
                                                    placeholder="Enter your email address"
                                                    className="pl-10 bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                    name="password"
                                                    placeholder="Create a secure password"
                                                    className="pl-10 bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="confirmPassword"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    {...field}
                                                    name="confirmPassword"
                                                    placeholder="Confirm your password"
                                                    className="pl-10 bg-black/60 border-gray-700 focus:border-violet-500 text-white placeholder:text-gray-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </span>
                                <span className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link href="/sign-in" className="text-violet-400 hover:text-violet-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}