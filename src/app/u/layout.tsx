import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: 'CryptiCat - Anonymous Messaging',
    description: 'Send messages anonymously - recipients won\'t know who sent them',
};

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <header className="p-4 border-b border-gray-800 bg-black/60 backdrop-blur-md">
                <div className="container mx-auto">
                    <Link href="/" className="text-xl font-bold flex items-center">
                        <Image
                            src="/bg-free-cat.png"
                            alt="CryptiCat Logo"
                            width={28}
                            height={28}
                            className="h-7 w-7 mr-2"
                        />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200">
                            CryptiCat
                        </span>
                    </Link>
                </div>
            </header>
            <main className="flex-grow">
                {children}
            </main>
            <footer className="py-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                <div className="container mx-auto px-4">
                    <p>© 2024 CryptiCat. All rights reserved.</p>
                    <p className="mt-1">
                        <Link href="/" className="text-violet-400 hover:text-violet-300 transition-colors">
                            Create your own anonymous message board
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
} 