import express, { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getPlayListBYTag, getSongs, toggleFavourite } from "../controllers/songController.js";

// Corrected line: use a dot instead of a slash
const songRouter = Router();

songRouter.get("/", getSongs);
songRouter.get("/PlaylistBytag/:tag", getPlayListBYTag);
songRouter.post("/favourites", protect, toggleFavourite);
songRouter.get("/favourites", protect, (req, res) => {
    res.json(req.user.favourites);
});

export default songRouter;
