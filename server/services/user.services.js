import { User } from "../models/user.schema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

// NO asyncHandler here! Just plain async
export const register = async (name, email, password) => {
    const userExist = await User.findOne({ email });

    if (userExist) {
        throw new ApiError(400, "User Already Exists");
    }

    const hassedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ name, email, password: hassedPassword });
    await newUser.save();

    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Pro-Tip: Remove password from the object before returning
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
};

export const login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User doesn't exist");
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