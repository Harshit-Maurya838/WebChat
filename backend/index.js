import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'

import authRoutes from './src/routes/auth.route.js'
import messageRoutes from './src/routes/message.route.js'
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import { app, server } from "./src/lib/socket.js";

import path from "path";

dotenv.config()
const __dirname = path.resolve();


const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}



server.listen(port, ()=>{
    console.log(`server is listening on ${port}`)
    connectDB()
})