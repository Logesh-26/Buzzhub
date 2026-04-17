import User from "../model/userModel.js";
import bcrypt from "bcryptjs"
import { tokenGeneration } from "../lib/token.js"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { email, username, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({message:"All fields are required"})
        }
        if (password.length < 6) {
            return res.status(400).json({message: "password atleast 6 characters"})
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({message: "User is already exist"})
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password:hashedpassword
        })
        await newUser.save()
        if (newUser) {
            tokenGeneration(newUser._id, res)
            res.json(newUser)
        }
    } catch (error) {
        console.log("error in signup", error.message)
        res.status(500).json({ message: "Internal server error" });
    };
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({message: "Invalid credentials"})
        }
        const ispassword = await bcrypt.compare(password, user.password)
        if (!ispassword) {
            res.status(400).json({message: "Incorrect password"})
        }
        tokenGeneration(user._id, res)
        return res.status(200).json(user);
    } catch (error) {
        console.log("error in Login", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({message: "logged out successfully"})
    } catch (error) {
        console.log("error in logout", error.message);
        res.status(500).json({message:"Internal server error."})
    }
    
}

export const updateProfile = async (req, res) => {
    try {
        const { profilepic } = req.body;
        const userId = req.user._id

    if (!profilepic) {
        return res.status(400).json({message:"profile pic is required"})
    }
    
    const uploadImage = await cloudinary.uploader.upload(profilepic)
    const updateUser = await User.findByIdAndUpdate(userId, { profilepic: uploadImage.secure_url },
            { new: true }
        );
    res.status(200).json(updateUser)
        
        
    } catch (error) {
        res.status(500).json({ message: "error in Updating Profile Pic", error: error.message });
    }
    
}