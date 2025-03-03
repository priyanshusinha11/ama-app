import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }

    interface User {
        id?: string;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}