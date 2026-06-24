import { User } from "../models/user.schema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto"
import { sendEmail } from "../utils/sendEmail.js"

// NO asyncHandler here! Just plain async
export const register = async (name, email, password) => {
    const userExist = await User.findOne({ email });

    if (userExist) {
        throw new ApiError(400, "User Already Exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const unhashedToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex")

    const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword,
        verifyToken : hashedToken,
        verifyTokenExpiry : Date.now() + 24 * 60 * 60 * 1000 
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verifyEmail/${unhashedToken}`

    await sendEmail({
        email: email,
        subject: "Verify your SwiftPass Account",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h2 style="color: #07A320;">Welcome to SwiftPass!</h2>
                <p>Hi ${name}, please verify your email to start booking and hosting events.</p>
                <a href="${verifyUrl}" style="background: #07A320; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 24 hours.</p>
            </div>
        `
    });

    await newUser.save();

    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return { userResponse, token };
};

export const login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User doesn't exist");
    }
    
    if (!user.isVerified) {
        throw new ApiError(404, "Your email is not verified. Please verify your account to login." );
    }

    const verify = await bcryptjs.compare(password, user.password);

    if (!verify) {
        throw new ApiError(401, "Email and Password doesn't match");
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
};