import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { userLogIn, userLogOut, userSearch, userSignUp } from "./controllers/server.controller.js";
const app=express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const  PORT=process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Toposel Assignment")
});

app.post("/signUp",userSignUp);
app.post("/logIn",userLogIn);
app.post("/userSearch",userSearch);
app.post("/logOut",userLogOut)

app.listen(PORT,()=>{
    console.log(`Listening on http://localhost:${PORT}`);
    connectDB();
});