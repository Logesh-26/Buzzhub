import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config()

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

const port = process.env.PORT || 5000;

import authRoute from "./routes/authRoute.js"
import messageRoute from "./routes/messageRoute.js";

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.get("/", (req, res) => {
    res.send("Backend running");
});

mongoose.connect(process.env.MONGODB_URI).then((res) => {
    console.log("mongoDB connected:" + res.connection.host);
    server.listen(port, () => {
        console.log(`server running on port ${ port }`)
    });
})

