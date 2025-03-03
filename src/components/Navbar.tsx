'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { Menu, X, MessageSquare, LogOut, User } from 'lucide-react';

function Navbar() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (status === 'loading') {
        return (
            <nav className="sticky top-0 z-50 p-4 md:p-5 shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto">
                    <div className="h-6 w-32 animate-pulse bg-white/20 rounded"></div>
                </div>
            </nav>
        );
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 p-4 md:p-5 shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold flex items-center">
                        <MessageSquare className="mr-2 h-6 w-6" />
                        <span className="hidden sm:inline">Whisperly</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <>
                                <div className="flex items-center mr-4">
                                    <User className="h-4 w-4 mr-2" />
                                    <span className="font-medium">{session.user.username || session.user.email}</span>
                                </div>
                                <Link href="/dashboard">
                                    <Button variant="secondary" size="sm" className="font-medium">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => signOut()}
                                    variant="outline"
                                    size="sm"
                                    className="text-white border-white hover:bg-white/20"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button variant="secondary" size="sm" className="font-medium">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white" onClick={toggleMenu}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 py-4 border-t border-white/20 space-y-4">
                        {session ? (
                            <>
                                <div className="flex items-center mb-4">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>{session.user.username || session.user.email}</span>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <Link href="/dashboard" onClick={toggleMenu}>
                                        <Button variant="secondary" className="w-full justify-start">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => signOut()}
                                        variant="outline"
                                        className="w-full justify-start text-white border-white hover:bg-white/20"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Link href="/sign-in" onClick={toggleMenu}>
                                <Button variant="secondary" className="w-full">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
