import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRouter.js";
import songRouter from "./routes/songRouter.js"; 

dotenv.config(".env");

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
connectDB();
app.use(
    cors({
        origin: "http://localhost:5173" ,
        credentials:true,
    })
);
// app.get("/",(req,res)=>{
//     res.status(200).json({message:"server is working"});
// });
app.use("/api/song",songRouter);
app.use("/api/auth",router);


app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

