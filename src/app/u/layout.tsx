import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export const metadata = {
    title: 'Whisperly - Anonymous Messaging',
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
                        <div className="p-1.5 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-sm rounded-md border border-violet-500/20 mr-2">
                            <MessageSquare className="h-5 w-5 text-violet-400" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200">
                            Whisperly
                        </span>
                    </Link>
                </div>
            </header>
            <main className="flex-grow">
                {children}
            </main>
            <footer className="py-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                <div className="container mx-auto px-4">
                    <p>© 2024 Whisperly. All rights reserved.</p>
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