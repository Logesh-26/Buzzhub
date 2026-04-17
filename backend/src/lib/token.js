import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.secretkey, { expiresIn: "14d" });
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
};

