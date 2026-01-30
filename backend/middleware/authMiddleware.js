import jwt from "jsonwebtoken";
import User from "../models/UserModel.js" ;
import dotenv from "dotenv";

dotenv.config();

export const protect =async(req,res,next) =>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startWith("Bearer")){
        return res.status(401).json({message:"not authorize ,missing Token"});
    }
    const token=authHeader.split("")[1];
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        const user=await User.findById(decoded,id).select("-password");
        if(!user) return res.status(401).josn({message:"Not Authorized"});
        req.user=user;
        next();
    }
    catch(errror){
        console.log("Token Varification Failed",error.message);
        return res.status(401).json({message:"INvalid or expired token"});
    }
};