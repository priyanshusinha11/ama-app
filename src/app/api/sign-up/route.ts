import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        // Check if a user already exists with the same username
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, { status: 400 });
        }

        // Check if a user already exists with the same email
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            return Response.json({
                success: false,
                message: "User already exists with this email",
            }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
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
