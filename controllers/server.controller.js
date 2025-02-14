import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const refreshToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });

    return refreshToken
};

const setCookie = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
        maxAge: 15 * 60 * 1000
    })
};

export const userSignUp = async (req, res) => {
    const { fullName, userName, email, password, dateOfBirth, gender, country } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        };

        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) return res.status(400).json({ message: "Password must have 6 characters" });

        const user = await User.create({ fullName, userName, email, password, dateOfBirth, gender, country });
        const accessToken = generateToken(user._id);
        setCookie(res, accessToken);
        res.status(201).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email
            },
            message: "User created successfully"
        })
    } catch (error) {
        console.log(`Error in userSignUp controller`, error.message)
        res.status(500).json({ message: error.message });
    }
};


export const userLogIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        };

        const isPassword = await user.comparePassword(password);
        if (!isPassword) {
            return res.status(400).json({ message: "Incorrect Credentials" });
        };


        const accessToken = generateToken(user._id);
        setCookie(res, accessToken);

        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email
            },
            message: "User login successfully"
        })
    } catch (error) {
        console.log(`Error in userLogIn controller`, error.message)
        res.status(500).json({ message: error.message });
    }
};

export const userSearch = async (req, res) => {
    const { userName } = req.body;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        };

        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email
            },
            message: "User Found"
        })
    } catch (error) {
        console.log(`Error in userSearch controller`, error.message)
        res.status(500).json({ message: error.message });
    }
};

export const userLogOut = async (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.json({message:"User LoggedOut Successfully"})
    } catch (error) {
        console.log(`Error in userLogOut controller`, error.message)
        res.status(500).json({ message: error.message });
    }
}