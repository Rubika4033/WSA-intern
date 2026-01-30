import express from "express";
import {getMe,login,signup,forgetPassword,resetPassword,editprofile} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js";
const router =express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/me",protect,getMe);
router.post("/forget-password",forgetPassword);
router.post("/reset-password/:token",resetPassword);
router.patch("/profile",protect,editprofile);

export default router;