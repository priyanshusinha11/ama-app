import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { username, email } = await request.json();

        // Check if a user already exists with the same username
        const existingUserByUsername = await prisma.user.findFirst({
            where: { username },
        });

        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, { status: 400 });
        }

        // Check if a user already exists with the same email
        const existingUserByEmail = await prisma.user.findFirst({
            where: { email },
        });

        if (existingUserByEmail) {
            return Response.json({
                success: false,
                message: "User already exists with this email",
            }, { status: 400 });
        }

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                isAcceptingMessages: true,
            },
        });

        return Response.json({
            success: true,
            message: "User registered successfully",
        }, { status: 201 });
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user",
        }, { status: 500 });
    }
}
