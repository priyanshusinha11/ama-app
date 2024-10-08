import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        // Check if a user already exists with the same username
        const existingUserByUsername = await UserModel.findOne({
            username,
        });
        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, { status: 400 });
        }

        // Check if a user already exists with the same email
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            return Response.json({
                success: false,
                message: "User already exists with this email",
            }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user without verification details
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            //isVerified: true,  // Mark the user as verified since there's no verification process
            isAcceptingMessages: true,
            messages: [],
        });

        // Save the new user to the database
        await newUser.save();

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
