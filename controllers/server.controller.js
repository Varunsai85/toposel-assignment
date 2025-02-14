import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const refreshToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });

    return refreshToken
};

const setCookie = (res, accessToken) => {
    res.cookie("accesToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
        maxAge: 15 * 60 * 1000
    })
}

export const userSignUp = async (req, res) => {
    const { fullName, userName, email, password, dateOfBirth, gender, country } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        };

        const user = await User.create({ fullName, userName, email, password, dateOfBirth, gender, country });
        const accessToken = generateToken(user._id);
        setCookie(res,accessToken);
        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email
            },
            message: "user created successfully"
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};