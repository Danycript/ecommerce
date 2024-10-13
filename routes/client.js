import { variations } from "../controllers/client.js";
import express from "express";

const router = express.Router();
router.get("/variation",variations)

export default router 