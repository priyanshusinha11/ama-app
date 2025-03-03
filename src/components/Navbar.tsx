'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { Menu, X, MessageSquare, LogOut, User, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

function Navbar() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (status === 'loading') {
        return (
            <nav className="sticky top-0 z-50 p-4 md:p-5 bg-black/60 backdrop-blur-md border-b border-gray-800">
                <div className="container mx-auto">
                    <div className="h-6 w-32 animate-pulse bg-violet-500/20 rounded"></div>
                </div>
            </nav>
        );
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 p-4 md:p-5 bg-black/60 backdrop-blur-md border-b border-gray-800">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold flex items-center">
                        <Image
                            src="/bg-free-cat.png"
                            alt="CryptiCat Logo"
                            width={36}
                            height={36}
                            className="h-9 w-9 mr-2"
                        />
                        <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200">
                            CryptiCat
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <>
                                <div className="flex items-center mr-4 text-gray-300">
                                    <div className="p-1 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-sm rounded-full border border-violet-500/20 mr-2">
                                        <User className="h-3 w-3 text-violet-400" />
                                    </div>
                                    <span className="font-medium">{session.user.username || session.user.email}</span>
                                </div>
                                <Link href="/feed">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-700 bg-black/40 text-cyan-300 hover:bg-black/60 hover:border-cyan-500"
                                    >
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Feed
                                    </Button>
                                </Link>
                                <Link href="/messages">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-700 bg-black/40 text-violet-300 hover:bg-black/60 hover:border-violet-500"
                                    >
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Messages
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => signOut()}
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-700 bg-black/40 text-gray-300 hover:bg-black/60 hover:border-red-500 hover:text-red-400"
                                >
                                    <LogOut className="h-3 w-3 mr-1" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 relative overflow-hidden group"
                                    size="sm"
                                >
                                    <span className="relative z-10">Sign In</span>
                                    <span className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-1.5 bg-black/40 backdrop-blur-sm rounded-md border border-gray-800 text-gray-300 hover:text-white hover:border-violet-500/50 transition-colors"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden mt-4 py-4 border-t border-gray-800 space-y-4"
                    >
                        {session ? (
                            <>
                                <div className="flex items-center mb-4 text-gray-300">
                                    <div className="p-1 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-sm rounded-full border border-violet-500/20 mr-2">
                                        <User className="h-3 w-3 text-violet-400" />
                                    </div>
                                    <span>{session.user.username || session.user.email}</span>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <Link href="/feed" onClick={toggleMenu}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start border-gray-700 bg-black/40 text-cyan-300 hover:bg-black/60 hover:border-cyan-500"
                                        >
                                            <Sparkles className="h-3 w-3 mr-2" />
                                            Feed
                                        </Button>
                                    </Link>
                                    <Link href="/messages" onClick={toggleMenu}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start border-gray-700 bg-black/40 text-violet-300 hover:bg-black/60 hover:border-violet-500"
                                        >
                                            <MessageSquare className="h-3 w-3 mr-2" />
                                            Messages
                                            <ChevronRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => signOut()}
                                        variant="outline"
                                        className="w-full justify-start border-gray-700 bg-black/40 text-gray-300 hover:bg-black/60 hover:border-red-500 hover:text-red-400"
                                    >
                                        <LogOut className="h-3 w-3 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Link href="/sign-in" onClick={toggleMenu}>
                                <Button
                                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Sign In</span>
                                    <span className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
