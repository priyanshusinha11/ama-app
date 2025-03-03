'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

function Navbar() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return null; // Prevent rendering until session is available
    }

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                    Whisperly
                </a>
                {session ? (
                    <div className="flex items-center space-x-4">
                        <span>Welcome, {session.user.username || session.user.email}</span>
                        {/* Dashboard Button */}
                        <Link href="/dashboard">
                            <Button className="bg-slate-100 text-black" variant='outline'>
                                Dashboard
                            </Button>
                        </Link>
                        {/* Logout Button */}
                        <Button
                            onClick={() => signOut()}
                            className="bg-slate-100 text-black"
                            variant="outline"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/sign-in">
                        <Button className="bg-slate-100 text-black" variant="outline">
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
