import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { userSignUp } from "./controllers/server.controller.js";
const app=express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const  PORT=process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Toposel Assignment")
});

app.post("/user-registration",userSignUp);

app.listen(PORT,()=>{
    console.log(`Listening on http://localhost:${PORT}`);
    connectDB();
});